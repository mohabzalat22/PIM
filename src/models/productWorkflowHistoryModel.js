import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findByProductId = async (productId) => {
  return await prisma.productWorkflowHistory.findMany({
    where: { productId },
    include: {
      changedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const create = async (data) => {
  return await prisma.productWorkflowHistory.create({
    data,
    include: {
      changedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const findAll = async (skip, limit, filters = {}) => {
  const where = {};

  if (filters.productId) {
    where.productId = parseInt(filters.productId);
  }

  if (filters.changedById) {
    where.changedById = parseInt(filters.changedById);
  }

  return await Promise.all([
    prisma.productWorkflowHistory.findMany({
      skip,
      take: limit,
      where,
      include: {
        product: {
          select: {
            id: true,
            sku: true,
          },
        },
        changedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.productWorkflowHistory.count({ where }),
  ]);
};
