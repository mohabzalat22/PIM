import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findAll = async (skip = 0, limit = 10, filters = {}) => {
  const where = {};
  
  // Search filter (code and label search)
  if (filters.search) {
    where.OR = [
      { code: { contains: filters.search, mode: 'insensitive' } },
      { label: { contains: filters.search, mode: 'insensitive' } }
    ];
  }
  
  // Data type filter
  if (filters.dataType) {
    where.dataType = filters.dataType;
  }
  
  // Input type filter
  if (filters.inputType) {
    where.inputType = filters.inputType;
  }
  
  // Filterable filter
  if (filters.isFilterable !== null && filters.isFilterable !== undefined) {
    where.isFilterable = filters.isFilterable === 'true' || filters.isFilterable === true;
  }
  
  // Global filter
  if (filters.isGlobal !== null && filters.isGlobal !== undefined) {
    where.isGlobal = filters.isGlobal === 'true' || filters.isGlobal === true;
  }
  
  // Sorting
  const orderBy = {};
  if (filters.sortBy === 'code') {
    orderBy.code = filters.sortOrder || 'asc';
  } else if (filters.sortBy === 'label') {
    orderBy.label = filters.sortOrder || 'asc';
  } else {
    orderBy.createdAt = filters.sortOrder || 'desc';
  }

  return await Promise.all([
    prisma.attribute.findMany({
      skip,
      take: limit,
      where,
      include: {
        productAttributeValues: {
          include: {
            product: true,
            storeView: true,
          },
        },
      },
      orderBy,
    }),
    prisma.attribute.count({ where }),
  ]);
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
