// prisma/factories/productFactory.ts
import { faker } from "@faker-js/faker";
import { Prisma, ProductType } from "@prisma/client";

export function createProduct(): Prisma.ProductCreateInput {
  return {
    sku: faker.string.alphanumeric(10),
    type: faker.helpers.arrayElement(Object.values(ProductType)),
  };
}
