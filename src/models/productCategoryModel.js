import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async () => {
  return await prisma.productCategory.findMany({
    include: {
      product: true,
      category: {
        include: {
          translations: true,
        },
      },
    },
  });
};

export const findByProductId = async (productId) => {
  return await prisma.productCategory.findMany({
    where: { productId: productId },
    include: {
      product: true,
      category: {
        include: {
          translations: true,
        },
      },
    },
  });
};

export const findByCategoryId = async (categoryId) => {
  return await prisma.productCategory.findMany({
    where: { categoryId: categoryId },
    include: {
      product: true,
      category: {
        include: {
          translations: true,
        },
      },
    },
  });
};

export const findByCompositeKey = async (productId, categoryId) => {
  return await prisma.productCategory.findUnique({
    where: {
      productId_categoryId: {
        productId: productId,
        categoryId: categoryId,
      },
    },
    include: {
      product: true,
      category: {
        include: {
          translations: true,
        },
      },
    },
  });
};

export const create = async (data) => {
  return await prisma.productCategory.create({
    data: data,
    include: {
      product: true,
      category: {
        include: {
          translations: true,
        },
      },
    },
  });
};

export const deleteByCompositeKey = async (productId, categoryId) => {
  return await prisma.productCategory.delete({
    where: {
      productId_categoryId: {
        productId: productId,
        categoryId: categoryId,
      },
    },
  });
};
