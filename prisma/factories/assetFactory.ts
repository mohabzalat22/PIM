import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createAsset(): Prisma.AssetCreateInput {
  return {
    filePath: faker.image.url({}),
    mimeType: "image/jpeg",
  };
}
