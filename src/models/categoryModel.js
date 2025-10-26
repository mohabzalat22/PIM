import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (skip = 0, limit = 10, filters = {}) => {
  const where = {};
  
  // Search filter (search in translations)
  if (filters.search) {
    where.translations = {
      some: {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { slug: { contains: filters.search, mode: 'insensitive' } }
        ]
      }
    };
  }
  
  // Parent filter
  if (filters.parentId !== null && filters.parentId !== undefined) {
    where.parentId = filters.parentId === 'null' ? null : parseInt(filters.parentId);
  }
  
  // Sorting
  const orderBy = {};
  if (filters.sortBy === 'name') {
    orderBy.translations = {
      _count: 'desc'
    };
  } else {
    orderBy.createdAt = filters.sortOrder || 'desc';
  }

  return await Promise.all([
    prisma.category.findMany({
      skip,
      take: limit,
      where,
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
      orderBy,
    }),
    prisma.category.count({ where }),
  ]);
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
