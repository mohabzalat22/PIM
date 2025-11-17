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

  // Store filter
  if (filters.storeId) {
    where.storeId = parseInt(filters.storeId);
  }

  // Locale filter
  if (filters.localeId) {
    where.localeId = parseInt(filters.localeId);
  }

  // Sorting
  const orderBy = {};
  if (filters.sortBy === 'code') {
    orderBy.code = filters.sortOrder || 'asc';
  } else if (filters.sortBy === 'name') {
    orderBy.name = filters.sortOrder || 'asc';
  } else if (filters.sortBy === 'locale') {
    orderBy.locale = {
      value: filters.sortOrder || 'asc'
    };
  } else {
    orderBy.createdAt = filters.sortOrder || 'desc';
  }

  return await Promise.all([
    prisma.storeView.findMany({
      skip,
      take: limit,
      where,
      include: {
        store: true,
        locale: true,
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
      orderBy,
    }),
    prisma.storeView.count({ where }),
  ]);
};

export const findById = async (id) => {
  return await prisma.storeView.findUnique({
    where: { id: id },
    include: {
      store: true,
      locale: true,
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
      locale: true,
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
      locale: true,
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
      locale: true,
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
      locale: true,
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
