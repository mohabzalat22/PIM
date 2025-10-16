import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async () => {
  return await prisma.asset.findMany({
    include: {
      productAssets: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const findById = async (id) => {
  return await prisma.asset.findUnique({
    where: { id: id },
    include: {
      productAssets: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const findByFilePath = async (filePath) => {
  return await prisma.asset.findFirst({ where: { filePath: filePath } });
};

export const create = async (data) => {
  return await prisma.asset.create({
    data: data,
  });
};

export const update = async (id, data) => {
  return await prisma.asset.update({
    where: { id: id },
    data: data,
  });
};

export const deleteById = async (id) => {
  return await prisma.asset.delete({ where: { id: id } });
};
