import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (skip = 0, limit = 10, filters = {}) => {
  const where = {};

  // Search filter (code and name search)
  if (filters.search) {
    where.OR = [
      { code: { contains: filters.search, mode: 'insensitive' } },
      { name: { contains: filters.search, mode: 'insensitive' } }
    ];
  }

  // Sorting
  const orderBy = {};
  if (filters.sortBy === 'code') {
    orderBy.code = filters.sortOrder || 'asc';
  } else if (filters.sortBy === 'name') {
    orderBy.name = filters.sortOrder || 'asc';
  } else {
    orderBy.createdAt = filters.sortOrder || 'desc';
  }

  return await Promise.all([
    prisma.store.findMany({
      skip,
      take: limit,
      where,
      include: {
        storeViews: true,
      },
      orderBy,
    }),
    prisma.store.count({ where }),
  ]);
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
