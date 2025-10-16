import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async () => {
  return await prisma.storeView.findMany({
    include: {
      store: true,
      productAttributeValues: {
        include: {
          product: true,
          attribute: true,
        },
      },
      categoryTranslations: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const findById = async (id) => {
  return await prisma.storeView.findUnique({
    where: { id: id },
    include: {
      store: true,
      productAttributeValues: {
        include: {
          product: true,
          attribute: true,
        },
      },
      categoryTranslations: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const findByCode = async (code) => {
  return await prisma.storeView.findUnique({
    where: { code: code },
    include: {
      store: true,
      productAttributeValues: {
        include: {
          product: true,
          attribute: true,
        },
      },
      categoryTranslations: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const findByStoreId = async (storeId) => {
  return await prisma.storeView.findMany({
    where: { storeId: storeId },
    include: {
      store: true,
      productAttributeValues: {
        include: {
          product: true,
          attribute: true,
        },
      },
      categoryTranslations: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const create = async (data) => {
  return await prisma.storeView.create({
    data: data,
    include: {
      store: true,
      productAttributeValues: {
        include: {
          product: true,
          attribute: true,
        },
      },
      categoryTranslations: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const update = async (id, data) => {
  return await prisma.storeView.update({
    where: { id: id },
    data: data,
    include: {
      store: true,
      productAttributeValues: {
        include: {
          product: true,
          attribute: true,
        },
      },
      categoryTranslations: {
        include: {
          category: true,
        },
      },
    },
  });
};

export const deleteById = async (id) => {
  return await prisma.storeView.delete({ where: { id: id } });
};
