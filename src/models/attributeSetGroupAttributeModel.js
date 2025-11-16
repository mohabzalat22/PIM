import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addAttributeToGroup = async (data) => {
  const { attributeSetId, attributeGroupId, attributeId, sortOrder } = data;

  return await prisma.attributeSetGroupAttribute.create({
    data: {
      attributeSetId,
      attributeGroupId,
      attributeId,
      sortOrder: sortOrder ?? 0,
    },
    include: {
      attributeSet: true,
      attributeGroup: true,
      attribute: true,
    },
  });
};

export const removeAttributeFromGroup = async (id) => {
  return await prisma.attributeSetGroupAttribute.delete({ where: { id } });
};

export const listByGroup = async (attributeGroupId) => {
  return await prisma.attributeSetGroupAttribute.findMany({
    where: { attributeGroupId },
    include: {
      attribute: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
};
