import { faker } from "@faker-js/faker";
import { Prisma, ProductType } from "@prisma/client";

export function createAttributeSet(): Prisma.AttributeSetCreateInput {
  return {
    code: faker.string.alphanumeric(8).toLowerCase(),
    label: faker.commerce.department(),
    productType: faker.helpers.arrayElement([...Object.values(ProductType), null]),
    isDefault: faker.datatype.boolean({ probability: 0.2 }),
  };
}
