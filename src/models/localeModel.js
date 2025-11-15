import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (skip = 0, limit = 10, filters = {}) => {
  const where = {};

  if (filters.search) {
    where.OR = [
      { value: { contains: filters.search, mode: "insensitive" } },
      { label: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  // Sorting (mirror productModel pattern)
  const orderBy = {};
  if (filters.sortBy === "value") {
    orderBy.value = filters.sortOrder || "asc";
  } else {
    // default to createdAt
    orderBy.createdAt = filters.sortOrder || "desc";
  }

  return await Promise.all([
    prisma.locale.findMany({
      skip,
      take: limit,
      where,
      orderBy,
    }),
    prisma.locale.count({ where }),
  ]);
};

export const findById = async (id) => {
  return await prisma.locale.findUnique({ where: { id } });
};

export const findByValue = async (value) => {
  return await prisma.locale.findUnique({ where: { value } });
};

export const create = async (data) => {
  return await prisma.locale.create({ data });
};

export const update = async (id, data) => {
  return await prisma.locale.update({ where: { id }, data });
};

export const deleteById = async (id) => {
  return await prisma.locale.delete({ where: { id } });
};
