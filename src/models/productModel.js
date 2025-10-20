import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (skip, limit) => {
  return await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
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
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count(),
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
