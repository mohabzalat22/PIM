import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const findAll = async (skip = 0, limit = 10, filters = {}) => {
  const where = {};

  if (filters.search) {
    where.OR = [
      { code: { contains: filters.search, mode: "insensitive" } },
      { label: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.attributeSetId) {
    where.attributeSetId = parseInt(filters.attributeSetId);
  }

  const orderBy = {};
  if (filters.sortBy === "code") {
    orderBy.code = filters.sortOrder || "asc";
  } else if (filters.sortBy === "label") {
    orderBy.label = filters.sortOrder || "asc";
  } else {
    orderBy.sortOrder = filters.sortOrder || "asc";
  }

  return await Promise.all([
    prisma.attributeGroup.findMany({
      skip,
      take: limit,
      where,
      include: {
        attributeSet: true,
        groupAttributes: {
          include: {
            attribute: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
      orderBy,
    }),
    prisma.attributeGroup.count({ where }),
  ]);
};

export const findById = async (id) => {
  return await prisma.attributeGroup.findUnique({
    where: { id },
    include: {
      attributeSet: true,
      groupAttributes: {
        include: {
          attribute: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

export const create = async (data) => {
  const { attributeSetId, code, label, sortOrder } = data;

  return await prisma.attributeGroup.create({
    data: {
      attributeSetId,
      code,
      label,
      sortOrder: sortOrder ?? 0,
    },
    include: {
      attributeSet: true,
      groupAttributes: {
        include: {
          attribute: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
};

export const update = async (id, data) => {
  const { attributeSetId, code, label, sortOrder } = data;

  return await prisma.$transaction(async (tx) => {
    const existingGroup = await tx.attributeGroup.findUnique({
      where: { id },
      include: {
        groupAttributes: true,
      },
    });

    if (!existingGroup) {
      return null;
    }

    const currentSetId = existingGroup.attributeSetId;
    const newSetId = attributeSetId ?? currentSetId;

    // If attribute set is changing, we need to:
    // 1) remove group-attribute relations that already exist in the target set
    // 2) move remaining relations to the new set
    if (newSetId && newSetId !== currentSetId) {
      const attributeIds = existingGroup.groupAttributes.map((ga) => ga.attributeId);

      if (attributeIds.length > 0) {
        const conflictingInSet = await tx.attributeSetAttribute.findMany({
          where: {
            attributeSetId: newSetId,
            attributeId: { in: attributeIds },
          },
          select: { attributeId: true },
        });

        const conflictingInGroups = await tx.attributeSetGroupAttribute.findMany({
          where: {
            attributeSetId: newSetId,
            attributeId: { in: attributeIds },
          },
          select: { attributeId: true },
        });

        const conflictingIds = Array.from(
          new Set([
            ...conflictingInSet.map((r) => r.attributeId),
            ...conflictingInGroups.map((r) => r.attributeId),
          ])
        );

        if (conflictingIds.length > 0) {
          await tx.attributeSetGroupAttribute.deleteMany({
            where: {
              attributeGroupId: id,
              attributeId: { in: conflictingIds },
            },
          });
        }

        await tx.attributeSetGroupAttribute.updateMany({
          where: {
            attributeGroupId: id,
            attributeSetId: currentSetId,
          },
          data: {
            attributeSetId: newSetId,
          },
        });
      }
    }

    const updatedGroup = await tx.attributeGroup.update({
      where: { id },
      data: {
        attributeSetId: newSetId,
        code,
        label,
        sortOrder: sortOrder ?? 0,
      },
      include: {
        attributeSet: true,
        groupAttributes: {
          include: {
            attribute: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return updatedGroup;
  });
};

export const deleteById = async (id) => {
  return await prisma.attributeGroup.delete({ where: { id } });
};
