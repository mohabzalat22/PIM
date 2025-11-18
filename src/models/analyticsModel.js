import prisma from "@prisma/client";

const prismaClient = new prisma.PrismaClient();

/**
 * Get dashboard analytics data
 * Includes product analytics, category analytics, attribute analytics, etc.
 */
export const getDashboardAnalytics = async () => {
  try {
    // Get current date and date 30 days ago for timeline
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Products by Type
    const productsByType = await prismaClient.product.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    });

    const formattedProductsByType = productsByType.map(item => ({
      type: item.type,
      count: item._count.id
    }));

    // 2. Product Growth - Last 30 days
    const productGrowthData = await prismaClient.product.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        createdAt: true
      }
    });

    // Group by date
    const growthByDate = {};
    productGrowthData.forEach(product => {
      const date = product.createdAt.toISOString().split('T')[0];
      growthByDate[date] = (growthByDate[date] || 0) + 1;
    });

    const productGrowth = Object.entries(growthByDate).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3. Product Completeness (products with/without attributes)
    const totalProducts = await prismaClient.product.count();
    const productsWithAttributes = await prismaClient.product.findMany({
      include: {
        productAttributeValues: true
      }
    });

    const complete = productsWithAttributes.filter(p => p.productAttributeValues.length >= 5).length;
    const incomplete = productsWithAttributes.filter(p => p.productAttributeValues.length > 0 && p.productAttributeValues.length < 5).length;
    const draft = totalProducts - complete - incomplete;

    const productCompleteness = {
      complete,
      incomplete,
      draft
    };

    // 4. Top Categories by Product Count
    const categories = await prismaClient.category.findMany({
      include: {
        productCategories: true,
        translations: {
          take: 1
        }
      }
    });

    const topCategories = categories
      .map(category => ({
        id: category.id,
        name: category.translations[0]?.name || `Category ${category.id}`,
        productCount: category.productCategories.length,
        percentage: totalProducts > 0 ? Math.round((category.productCategories.length / totalProducts) * 100) : 0
      }))
      .filter(cat => cat.productCount > 0)
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 10);

    // 5. Attribute Usage - Most used attributes
    const attributes = await prismaClient.attribute.findMany({
      include: {
        productAttributeValues: true
      }
    });

    const attributeUsage = attributes
      .map(attr => ({
        id: attr.id,
        name: attr.label || attr.code,
        usageCount: attr.productAttributeValues.length,
        dataType: attr.dataType
      }))
      .filter(attr => attr.usageCount > 0)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);

    // 6. Asset Coverage
    const productsWithAssets = await prismaClient.productAsset.groupBy({
      by: ['productId'],
      _count: {
        id: true
      }
    });

    const assetsGroupedByType = await prismaClient.productAsset.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    });

    const assetCoverage = {
      withAssets: productsWithAssets.length,
      withoutAssets: totalProducts - productsWithAssets.length,
      byType: assetsGroupedByType.map(item => ({
        type: item.type,
        count: item._count.id
      }))
    };

    // 7. Store View Coverage
    const storeViews = await prismaClient.storeView.findMany({
      include: {
        productAttributeValues: {
          distinct: ['productId']
        }
      }
    });

    const storeViewCoverage = storeViews.map(sv => ({
      id: sv.id,
      name: sv.name,
      code: sv.code,
      productsWithValues: sv.productAttributeValues.length
    }));

    // 8. Timeline - Overall growth (products, categories, attributes over last 30 days)
    const timelineData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const productsUpToDate = await prismaClient.product.count({
        where: {
          createdAt: {
            lte: date
          }
        }
      });

      const categoriesUpToDate = await prismaClient.category.count({
        where: {
          createdAt: {
            lte: date
          }
        }
      });

      const attributesUpToDate = await prismaClient.attribute.count({
        where: {
          createdAt: {
            lte: date
          }
        }
      });

      timelineData.push({
        date: dateStr,
        products: productsUpToDate,
        categories: categoriesUpToDate,
        attributes: attributesUpToDate
      });
    }

    // 9. Attribute Type Distribution
    const attributeTypeDistribution = await prismaClient.attribute.groupBy({
      by: ['dataType'],
      _count: {
        id: true
      }
    });

    const formattedAttributeTypeDistribution = attributeTypeDistribution.map(item => ({
      type: item.dataType,
      count: item._count.id
    }));

    // Return all analytics data
    return {
      productsByType: formattedProductsByType,
      productGrowth,
      productCompleteness,
      topCategories,
      attributeUsage,
      assetCoverage,
      storeViewCoverage,
      timeline: timelineData,
      attributeTypeDistribution: formattedAttributeTypeDistribution,
      summary: {
        totalProducts,
        totalCategories: categories.length,
        totalAttributes: attributes.length,
        totalStoreViews: storeViews.length,
        productsLast7Days: productGrowthData.filter(p => p.createdAt >= sevenDaysAgo).length
      }
    };
  } catch (error) {
    throw error;
  }
};
