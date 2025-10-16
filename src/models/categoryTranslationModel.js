import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async () => {
  return await prisma.categoryTranslation.findMany({
    include: {
      category: true,
      storeView: true,
    },
  });
};

export const findById = async (id) => {
  return await prisma.categoryTranslation.findUnique({
    where: { id: id },
    include: {
      category: true,
      storeView: true,
    },
  });
};

export const findByCategoryId = async (categoryId) => {
  return await prisma.categoryTranslation.findMany({
    where: { categoryId: categoryId },
    include: {
      category: true,
      storeView: true,
    },
  });
};

export const findByStoreViewId = async (storeViewId) => {
  return await prisma.categoryTranslation.findMany({
    where: { storeViewId: storeViewId },
    include: {
      category: true,
      storeView: true,
    },
  });
};

export const findByCompositeKey = async (categoryId, storeViewId) => {
  return await prisma.categoryTranslation.findUnique({
    where: {
      categoryId_storeViewId: {
        categoryId: categoryId,
        storeViewId: storeViewId,
      },
    },
    include: {
      category: true,
      storeView: true,
    },
  });
};

export const create = async (data) => {
  return await prisma.categoryTranslation.create({
    data: data,
    include: {
      category: true,
      storeView: true,
    },
  });
};

export const update = async (id, data) => {
  return await prisma.categoryTranslation.update({
    where: { id: id },
    data: data,
    include: {
      category: true,
      storeView: true,
    },
  });
};

export const deleteById = async (id) => {
  return await prisma.categoryTranslation.delete({ where: { id: id } });
};
