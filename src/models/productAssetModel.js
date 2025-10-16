import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async () => {
  return await prisma.productAsset.findMany({
    include: {
      product: true,
      asset: true,
    },
  });
};

export const findByProductId = async (productId) => {
  return await prisma.productAsset.findMany({
    where: { productId: productId },
    include: {
      product: true,
      asset: true,
    },
  });
};

export const findByAssetId = async (assetId) => {
  return await prisma.productAsset.findMany({
    where: { assetId: assetId },
    include: {
      product: true,
      asset: true,
    },
  });
};

export const findByCompositeKey = async (productId, assetId, type) => {
  return await prisma.productAsset.findUnique({
    where: {
      productId_assetId_type: {
        productId: productId,
        assetId: assetId,
        type: type,
      },
    },
    include: {
      product: true,
      asset: true,
    },
  });
};

export const create = async (data) => {
  return await prisma.productAsset.create({
    data: data,
    include: {
      product: true,
      asset: true,
    },
  });
};

export const update = async (productId, assetId, type, data) => {
  return await prisma.productAsset.update({
    where: {
      productId_assetId_type: {
        productId: productId,
        assetId: assetId,
        type: type,
      },
    },
    data: data,
    include: {
      product: true,
      asset: true,
    },
  });
};

export const deleteByCompositeKey = async (productId, assetId, type) => {
  return await prisma.productAsset.delete({
    where: {
      productId_assetId_type: {
        productId: productId,
        assetId: assetId,
        type: type,
      },
    },
  });
};
