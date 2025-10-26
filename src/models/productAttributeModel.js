import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findAll = async (skip = 0, limit = 10, filters = {}) => {
  const where = {};

  // Search filter (search in product SKU and attribute code/label)
  if (filters.search) {
    where.OR = [
      { product: { sku: { contains: filters.search, mode: 'insensitive' } } },
      { attribute: { code: { contains: filters.search, mode: 'insensitive' } } },
      { attribute: { label: { contains: filters.search, mode: 'insensitive' } } }
    ];
  }

  // Product filter
  if (filters.productId) {
    where.productId = parseInt(filters.productId);
  }

  // Attribute filter
  if (filters.attributeId) {
    where.attributeId = parseInt(filters.attributeId);
  }

  // Store view filter
  if (filters.storeViewId) {
    where.storeViewId = parseInt(filters.storeViewId);
  }

  // Data type filter
  if (filters.dataType) {
    where.attribute = {
      dataType: filters.dataType
    };
  }

  // Sorting
  const orderBy = {};
  if (filters.sortBy === 'productId') {
    orderBy.productId = filters.sortOrder || 'asc';
  } else if (filters.sortBy === 'attributeId') {
    orderBy.attributeId = filters.sortOrder || 'asc';
  } else if (filters.sortBy === 'storeViewId') {
    orderBy.storeViewId = filters.sortOrder || 'asc';
  } else {
    orderBy.createdAt = filters.sortOrder || 'desc';
  }

  return await Promise.all([
    prisma.productAttributeValue.findMany({
      skip,
      take: limit,
      where,
      include: {
        product: true,
        attribute: true,
        storeView: {
          include: {
            store: true,
          },
        },
      },
      orderBy,
    }),
    prisma.productAttributeValue.count({ where }),
  ]);
};

export const findById = async (id) => {
  return await prisma.productAttributeValue.findUnique({
    where: { id: id },
    include: {
      product: true,
      attribute: true,
      storeView: {
        include: {
          store: true,
        },
      },
    },
  });
};

export const create = async (data) => {
  return await prisma.productAttributeValue.create({
    data: data,
    include: {
      product: true,
      attribute: true,
      storeView: {
        include: {
          store: true,
        },
      },
    },
  });
};

export const update = async (id, data) => {
  return await prisma.productAttributeValue.update({
    where: { id: id },
    data: data,
    include: {
      product: true,
      attribute: true,
      storeView: {
        include: {
          store: true,
        },
      },
    },
  });
};

export const findByProductId = async (productId) => {
  return await prisma.productAttributeValue.findMany({
    where: { productId: productId },
    include: {
      product: true,
      attribute: true,
      storeView: {
        include: {
          store: true,
        },
      },
    },
  });
};

export const findByAttributeId = async (attributeId) => {
  return await prisma.productAttributeValue.findMany({
    where: { attributeId: attributeId },
    include: {
      product: true,
      attribute: true,
      storeView: {
        include: {
          store: true,
        },
      },
    },
  });
};

export const findByStoreViewId = async (storeViewId) => {
  return await prisma.productAttributeValue.findMany({
    where: { storeViewId: storeViewId },
    include: {
      product: true,
      attribute: true,
      storeView: {
        include: {
          store: true,
        },
      },
    },
  });
};

export const findByCompositeKey = async (
  productId,
  attributeId,
  storeViewId
) => {
  return await prisma.productAttributeValue.findUnique({
    where: {
      productId_attributeId_storeViewId: {
        productId: productId,
        attributeId: attributeId,
        storeViewId: storeViewId,
      },
    },
    include: {
      product: true,
      attribute: true,
      storeView: {
        include: {
          store: true,
        },
      },
    },
  });
};

export const deleteByCompositeKey = async (
  productId,
  attributeId,
  storeViewId
) => {
  return await prisma.productAttributeValue.delete({
    where: {
      productId_attributeId_storeViewId: {
        productId: productId,
        attributeId: attributeId,
        storeViewId: storeViewId,
      },
    },
  });
};

export const deleteById = async (id) => {
  return await prisma.productAttributeValue.delete({ where: { id: id } });
};
