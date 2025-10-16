import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findAll = async () => {
  return await prisma.attribute.findMany({
    include: {
      productAttributeValues: {
        include: {
          product: true,
          storeView: true,
        },
      },
    },
  });
};

export const findById = async (id) => {
  return await prisma.attribute.findUnique({
    where: { id: id },
    include: {
      productAttributeValues: {
        include: {
          product: true,
          storeView: true,
        },
      },
    },
  });
};

export const findByCode = async (code) => {
  return await prisma.attribute.findUnique({
    where: { code: code },
    include: {
      productAttributeValues: {
        include: {
          product: true,
          storeView: true,
        },
      },
    },
  });
};

export const create = async (data) => {
  const code = data.code;
  const attributeExists = await prisma.attribute.findUnique({
    where: { code: code },
  });

  if (!code) {
    throw new Error("Attribute code is required");
  }

  if (attributeExists) {
    throw new Error("Attribute with the same code already exists");
  }

  return await prisma.attribute.create({
    data: data,
    include: {
      productAttributeValues: {
        include: {
          product: true,
          storeView: true,
        },
      },
    },
  });
};

export const update = async (id, data) => {
  return await prisma.attribute.update({
    where: { id: id },
    data: data,
    include: {
      productAttributeValues: {
        include: {
          product: true,
          storeView: true,
        },
      },
    },
  });
};

export const deleteById = async (id) => {
  return await prisma.attribute.delete({ where: { id: id } });
};
