import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async () => {
  return await prisma.category.findMany({
    include: {
      parent: true,
      subcategory: true,
      productCategories: {
        include: {
          product: true,
        },
      },
      translations: {
        include: {
          storeView: true,
        },
      },
    },
  });
};

export const findById = async (id) => {
  return await prisma.category.findUnique({
    where: { id: id },
    include: {
      parent: true,
      subcategory: true,
      productCategories: {
        include: {
          product: true,
        },
      },
      translations: {
        include: {
          storeView: true,
        },
      },
    },
  });
};

export const findByParentId = async (parentId) => {
  return await prisma.category.findMany({
    where: { parentId: parentId },
    include: {
      parent: true,
      subcategory: true,
      translations: {
        include: {
          storeView: true,
        },
      },
    },
  });
};

export const findRootCategories = async () => {
  return await prisma.category.findMany({
    where: { parentId: null },
    include: {
      subcategory: true,
      translations: {
        include: {
          storeView: true,
        },
      },
    },
  });
};

export const create = async (data) => {
  return await prisma.category.create({
    data: data,
    include: {
      parent: true,
      subcategory: true,
      translations: {
        include: {
          storeView: true,
        },
      },
    },
  });
};

export const update = async (id, data) => {
  return await prisma.category.update({
    where: { id: id },
    data: data,
    include: {
      parent: true,
      subcategory: true,
      translations: {
        include: {
          storeView: true,
        },
      },
    },
  });
};

export const deleteById = async (id) => {
  return await prisma.category.delete({ where: { id: id } });
};
