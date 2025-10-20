import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createProductAsset(
  productId: number,
  assetId: number
): Prisma.ProductAssetCreateInput {
  return {
    product: { connect: { id: productId } },
    asset: { connect: { id: assetId } },
    position: faker.number.int({ min: 1, max: 5 }),
    type: faker.helpers.arrayElement(["image", "video", "pdf", "manual"]),
  };
}
