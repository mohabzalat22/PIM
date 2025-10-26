import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (skip, limit, filters = {}) => {
  const where = {};
  
  // Search filter (SKU search)
  if (filters.search) {
    where.sku = {
      contains: filters.search,
      mode: 'insensitive'
    };
  }
  
  // Product type filter
  if (filters.type) {
    where.type = filters.type;
  }
  
  // Category filter
  if (filters.categoryId) {
    where.productCategories = {
      some: {
        categoryId: parseInt(filters.categoryId)
      }
    };
  }
  
  // Attribute filters (EAV filtering)
  if (filters.attributeFilters && Object.keys(filters.attributeFilters).length > 0) {
    where.productAttributeValues = {
      some: {
        OR: Object.entries(filters.attributeFilters).map(([attributeCode, value]) => {
          return {
            attribute: {
              code: attributeCode
            },
            OR: [
              { valueString: { contains: value, mode: 'insensitive' } },
              { valueText: { contains: value, mode: 'insensitive' } },
              { valueInt: value },
              { valueDecimal: value },
              { valueBoolean: value === 'true' || value === true }
            ]
          };
        })
      }
    };
  }
  
  // Sorting
  const orderBy = {};
  if (filters.sortBy === 'sku') {
    orderBy.sku = filters.sortOrder || 'asc';
  } else if (filters.sortBy === 'type') {
    orderBy.type = filters.sortOrder || 'asc';
  } else {
    orderBy.createdAt = filters.sortOrder || 'desc';
  }

  return await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where,
      include: {
        productAssets: {
          include: {
            asset: true,
          },
        },
        productCategories: {
          include: {
            category: {
              include: {
                translations: true,
              },
            },
          },
        },
        productAttributeValues: {
          include: {
            attribute: true,
            storeView: true,
          },
        },
      },
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);
};

export const findBySku = async (sku) => {
  return await prisma.product.findUnique({
    where: { sku: sku },
    include: {
      productAssets: {
        include: {
          asset: true,
        },
      },
      productCategories: {
        include: {
          category: {
            include: {
              translations: true,
            },
          },
        },
      },
      productAttributeValues: {
        include: {
          attribute: true,
          storeView: true,
        },
      },
    },
  });
};

export const findById = async (id) => {
  return await prisma.product.findUnique({
    where: { id: id },
    include: {
      productAssets: {
        include: {
          asset: true,
        },
      },
      productCategories: {
        include: {
          category: {
            include: {
              translations: true,
            },
          },
        },
      },
      productAttributeValues: {
        include: {
          attribute: true,
          storeView: true,
        },
      },
    },
  });
};

export const create = async (data) => {
  return await prisma.product.create({
    data: data,
    include: {
      productAssets: {
        include: {
          asset: true,
        },
      },
      productCategories: {
        include: {
          category: {
            include: {
              translations: true,
            },
          },
        },
      },
      productAttributeValues: {
        include: {
          attribute: true,
          storeView: true,
        },
      },
    },
  });
};

export const update = async (id, data) => {
  return await prisma.product.update({
    where: { id: id },
    data: data,
    include: {
      productAssets: {
        include: {
          asset: true,
        },
      },
      productCategories: {
        include: {
          category: {
            include: {
              translations: true,
            },
          },
        },
      },
      productAttributeValues: {
        include: {
          attribute: true,
          storeView: true,
        },
      },
    },
  });
};

export const deleteById = async (id) => {
  return await prisma.product.delete({ where: { id: id } });
};
