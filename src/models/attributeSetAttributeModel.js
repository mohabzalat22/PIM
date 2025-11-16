import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addAttributeToSet = async (data) => {
  const { attributeSetId, attributeId, sortOrder } = data;

  return await prisma.attributeSetAttribute.create({
    data: {
      attributeSetId,
      attributeId,
      sortOrder: sortOrder ?? 0,
    },
    include: {
      attributeSet: true,
      attribute: true,
    },
  });
};

export const removeAttributeFromSet = async (id) => {
  return await prisma.attributeSetAttribute.delete({ where: { id } });
};

export const listAttributesBySet = async (attributeSetId) => {
  return await prisma.attributeSetAttribute.findMany({
    where: { attributeSetId },
    include: {
      attribute: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
};
