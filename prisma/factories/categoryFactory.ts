import { Prisma } from "@prisma/client";

export function createCategory(parentId?: number): Prisma.CategoryCreateInput {
  return {
    parent: parentId ? { connect: { id: parentId } } : undefined,
  } as Prisma.CategoryCreateInput;
}
