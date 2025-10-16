import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findAll = async () => {
  return await prisma.productAttributeValue.findMany({
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
