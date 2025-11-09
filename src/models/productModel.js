import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (skip, limit, filters = {}) => {
  const where = {};
  
  // Search filter (SKU search)
  if (filters.search) {
    where.sku = {
      contains: filters.search,
      mode: 'sensitive'
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
    // First, fetch attributes to determine which are DATE type
    const attributeCodes = Object.keys(filters.attributeFilters);
    const attributes = await prisma.attribute.findMany({
      where: {
        code: { in: attributeCodes }
      },
      select: {
        code: true,
        inputType: true
      }
    });

    // Separate DATE and non-DATE attribute filters
    const dateAttributeCodes = new Set(
      attributes.filter(attr => attr.inputType === 'DATE').map(attr => attr.code)
    );
    
    const dateFilters = [];
    const nonDateFilters = [];

    Object.entries(filters.attributeFilters).forEach(([attributeCode, value]) => {
      if (!value) return; // Skip empty values
      
      if (dateAttributeCodes.has(attributeCode)) {
        // Parse date range: format "fromDate:toDate" or "fromDate" or ":toDate"
        const dateParts = value.split(':');
        const fromDate = dateParts[0] && dateParts[0].trim() !== '' ? dateParts[0].trim() : null;
        const toDate = dateParts[1] && dateParts[1].trim() !== '' ? dateParts[1].trim() : null;

        // Build date filter conditions only if at least one date is provided
        if (fromDate || toDate) {
          const dateConditions = {
            attribute: {
              code: attributeCode
            },
            valueString: {} // DATE values are stored in valueString
          };

          // If both from and to dates are provided, filter by range
          if (fromDate && toDate) {
            // Date stored as string in format YYYY-MM-DD, so we can do string comparison
            // For proper date comparison, we ensure the format matches
            dateConditions.valueString = {
              gte: fromDate, // greater than or equal to fromDate
              lte: toDate    // less than or equal to toDate
            };
          } else if (fromDate) {
            // Only from date - filter products with date >= fromDate
            dateConditions.valueString = {
              gte: fromDate
            };
          } else if (toDate) {
            // Only to date - filter products with date <= toDate
            dateConditions.valueString = {
              lte: toDate
            };
          }

          dateFilters.push(dateConditions);
        }
      } else {
        // Non-DATE attribute filters (text, number, boolean, etc.)
        nonDateFilters.push({
          attribute: {
            code: attributeCode
          },
          OR: [
            { valueString: { contains: value, mode: 'insensitive' } },
            { valueText: { contains: value, mode: 'insensitive' } },
            { valueInt: parseInt(value) || undefined },
            { valueDecimal: parseFloat(value) || undefined },
            { valueBoolean: value === 'true' || value === true }
          ].filter(condition => {
            // Remove undefined conditions
            return Object.values(condition)[0] !== undefined;
          })
        });
      }
    });

    // Combine DATE and non-DATE filters
    const allAttributeFilters = [];
    if (dateFilters.length > 0) {
      allAttributeFilters.push(...dateFilters);
    }
    if (nonDateFilters.length > 0) {
      allAttributeFilters.push(...nonDateFilters);
    }

    if (allAttributeFilters.length > 0) {
      where.productAttributeValues = {
        some: {
          OR: allAttributeFilters
        }
      };
    }
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
