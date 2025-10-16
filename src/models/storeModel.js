import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async () => {
  return await prisma.store.findMany({
    include: {
      storeViews: true,
    },
  });
};

export const findById = async (id) => {
  return await prisma.store.findUnique({
    where: { id: id },
    include: {
      storeViews: true,
    },
  });
};

export const findByCode = async (code) => {
  return await prisma.store.findUnique({
    where: { code: code },
    include: {
      storeViews: true,
    },
  });
};

export const create = async (data) => {
  return await prisma.store.create({
    data: data,
    include: {
      storeViews: true,
    },
  });
};

export const update = async (id, data) => {
  return await prisma.store.update({
    where: { id: id },
    data: data,
    include: {
      storeViews: true,
    },
  });
};

export const deleteById = async (id) => {
  return await prisma.store.delete({ where: { id: id } });
};
