import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (skip = 0, limit = 10, filters = {}) => {
  const where = {};

  if (filters.search) {
    where.OR = [
      { code: { contains: filters.search, mode: "insensitive" } },
      { label: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.productType) {
    where.productType = filters.productType;
  }

  if (filters.isDefault !== null && filters.isDefault !== undefined) {
    where.isDefault =
      filters.isDefault === "true" || filters.isDefault === true;
  }

  const orderBy = {};
  if (filters.sortBy === "code") {
    orderBy.code = filters.sortOrder || "asc";
  } else if (filters.sortBy === "label") {
    orderBy.label = filters.sortOrder || "asc";
  } else {
    orderBy.createdAt = filters.sortOrder || "desc";
  }

  return await Promise.all([
    prisma.attributeSet.findMany({
      skip,
      take: limit,
      where,
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
      orderBy,
    }),
    prisma.attributeSet.count({ where }),
  ]);
};

export const findById = async (id) => {
  return await prisma.attributeSet.findUnique({
    where: { id },
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
  });
};

export const create = async (data) => {
  const {
    code,
    label,
    productType,
    isDefault,
    attributes,
    groups,
  } = data;

  const result = await prisma.attributeSet.create({
    data: {
      code,
      label,
      productType: productType || null,
      isDefault: isDefault ?? false,
      setAttributes: attributes
        ? {
            create: attributes.map((item) => ({
              attributeId: item.attributeId,
              sortOrder: item.sortOrder ?? 0,
            })),
          }
        : undefined,
      groups: groups
        ? {
            create: groups.map((group) => ({
              code: group.code,
              label: group.label,
              sortOrder: group.sortOrder ?? 0,
            })),
          }
        : undefined,
    },
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
  });

  return result;
};

export const update = async (id, data) => {
  const { code, label, productType, isDefault } = data;

  return await prisma.attributeSet.update({
    where: { id },
    data: {
      code,
      label,
      productType: productType || null,
      isDefault: isDefault ?? false,
    },
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
  });
};

export const deleteById = async (id) => {
  return await prisma.attributeSet.delete({ where: { id } });
};
