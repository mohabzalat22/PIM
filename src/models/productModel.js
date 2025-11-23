import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (skip, limit, filters = {}) => {
  const where = {};
  // Search filter (SKU search)
  if (filters.search) {
    where.sku = {
      contains: filters.search,
    };
  }

  // Product type filter
  if (filters.type) {
    where.type = filters.type;
  }

  // Status filter
  if (filters.status) {
    where.status = filters.status;
  }

  // Assigned user filter
  if (filters.assignedTo) {
    where.assignedTo = parseInt(filters.assignedTo);
  }

  // Category filter
  if (filters.categoryId) {
    where.productCategories = {
      some: {
        categoryId: parseInt(filters.categoryId),
      },
    };
  }

  // Attribute filters (EAV filtering)
  if (
    filters.attributeFilters &&
    Object.keys(filters.attributeFilters).length > 0
  ) {
    // First, fetch attributes to determine which are DATE type
    const attributeCodes = Object.keys(filters.attributeFilters);
    const attributes = await prisma.attribute.findMany({
      where: {
        code: { in: attributeCodes },
      },
      select: {
        code: true,
        inputType: true,
        dataType: true,
      },
    });

    // Separate DATE and non-DATE attribute filters
    const dateAttributeCodes = new Set(
      attributes
        .filter((attr) => attr.inputType === "DATE")
        .map((attr) => attr.code)
    );

    // Process all filters and collect results
    const allAttributeFilters = await Promise.all(
      Object.entries(filters.attributeFilters).map(
        async ([attributeCode, value]) => {
          if (!value) return null; // Skip empty values

          if (dateAttributeCodes.has(attributeCode)) {
            // Parse date range: format "fromDate:toDate" or "fromDate" or ":toDate"
            const dateParts = value.split(":");
            const fromDate =
              dateParts[0] && dateParts[0].trim() !== ""
                ? dateParts[0].trim()
                : null;
            const toDate =
              dateParts[1] && dateParts[1].trim() !== ""
                ? dateParts[1].trim()
                : null;

            // Build date filter conditions only if at least one date is provided
            if (fromDate || toDate) {
              const dateConditions = {
                attribute: {
                  code: attributeCode,
                },
                valueString: {}, // DATE values are stored in valueString
              };

              // If both from and to dates are provided, filter by range
              if (fromDate && toDate) {
                dateConditions.valueString = {
                  gte: fromDate, // greater than or equal to fromDate
                  lte: toDate, // less than or equal to toDate
                };
              } else if (fromDate) {
                // Only from date - filter products with date >= fromDate
                dateConditions.valueString = {
                  gte: fromDate,
                };
              } else if (toDate) {
                // Only to date - filter products with date <= toDate
                dateConditions.valueString = {
                  lte: toDate,
                };
              }

              return dateConditions;
            }
            return null;
          } else {
            function canBeArray(value) {
              try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed);
              } catch {
                return false;
              }
            }
            // Non-DATE attribute filters (text, number, boolean, etc.)
            const attribute = await prisma.attribute.findUnique({
              where: { code: attributeCode },
            });
            if(canBeArray(value)) {
              const parsedValues = JSON.parse(value);
              switch (attribute.dataType) {
                case "STRING":
                case "TEXT":
                  return {
                    attribute: {
                      code: attributeCode,
                    },
                    OR: [
                      { valueString: { in: parsedValues, mode: "insensitive" } },
                      { valueText: { in: parsedValues, mode: "insensitive" } },
                    ],
                  };
                case "INT":
                  return {
                    attribute: {
                      code: attributeCode,
                    },
                    valueInt: { in: parsedValues.map((val) => parseInt(val)) },
                  };
                case "DECIMAL":
                  return {
                    attribute: {
                      code: attributeCode,
                    },
                    valueDecimal: { in: parsedValues.map((val) => parseFloat(val)) },
                  };
                case "BOOLEAN":
                  return {
                    attribute: {
                      code: attributeCode,
                    },
                    valueBoolean: { in: parsedValues.map((val) => val === "true" || val === true) },
                  };
                default:
                  return null;
              }
            } else {
              switch (attribute.dataType) {
                case "STRING":
                case "TEXT":
                  return {
                    attribute: {
                      code: attributeCode,
                    },
                    OR: [
                      { valueString: { startsWith: value, mode: "insensitive" } },
                      { valueText: { startsWith: value, mode: "insensitive" } },
                    ],
                  };
                case "INT":
                  return {
                    attribute: {
                      code: attributeCode,
                    },
                    valueInt: parseInt(value),
                  };
                case "DECIMAL":
                  return {
                    attribute: {
                      code: attributeCode,
                    },
                    valueDecimal: parseFloat(value),
                  };
                case "BOOLEAN":
                  return {
                    attribute: {
                      code: attributeCode,
                    },
                    valueBoolean: value === "true" || value === true,
                  };
                default:
                  return null;
              }
            }
          }
        }
      )
    );

    const validFilters = allAttributeFilters.filter((f) => f != null);

    if (validFilters.length > 0) {
      where.AND = validFilters.map((filter) => ({
        productAttributeValues: {
          some: filter,
        },
      }));
    }
  }

  // Sorting
  const orderBy = {};
  if (filters.sortBy === "sku") {
    orderBy.sku = filters.sortOrder || "asc";
  } else if (filters.sortBy === "type") {
    orderBy.type = filters.sortOrder || "asc";
  } else {
    orderBy.createdAt = filters.sortOrder || "desc";
  }

  return await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where,
      include: {
        attributeSet: true,
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
      attributeSet: true,
      assignedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      assignedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      attributeSet: {
        include: {
          groups: {
            include: {
              groupAttributes: {
                include: {
                  attribute: true,
                },
                orderBy: {
                  sortOrder: "asc",
                },
              },
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
          setAttributes: {
            include: {
              attribute: true,
            },
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      },
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
      attributeSet: true,
      assignedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
      attributeSet: true,
      assignedUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
