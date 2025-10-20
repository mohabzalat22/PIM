import { Prisma } from "@prisma/client";

export function createProductCategory(
  productId: number,
  categoryId: number
): Prisma.ProductCategoryCreateInput {
  return {
    product: { connect: { id: productId } },
    category: { connect: { id: categoryId } },
  };
}
