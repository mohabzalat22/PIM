import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (skip = 0, limit = 10, filters = {}) => {
  const where = {};
  
  // Search filter (file path search)
  if (filters.search) {
    where.filePath = {
      contains: filters.search,
      mode: 'insensitive'
    };
  }
  
  // MIME type filter
  if (filters.mimeType) {
    where.mimeType = filters.mimeType;
  }
  
  // Sorting
  const orderBy = {};
  if (filters.sortBy === 'filePath') {
    orderBy.filePath = filters.sortOrder || 'asc';
  } else if (filters.sortBy === 'mimeType') {
    orderBy.mimeType = filters.sortOrder || 'asc';
  } else {
    orderBy.createdAt = filters.sortOrder || 'desc';
  }

  return await Promise.all([
    prisma.asset.findMany({
      skip,
      take: limit,
      where,
      include: {
        productAssets: {
          include: {
            product: true,
          },
        },
      },
      orderBy,
    }),
    prisma.asset.count({ where }),
  ]);
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
