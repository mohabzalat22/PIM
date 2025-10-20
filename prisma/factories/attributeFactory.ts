import { faker } from "@faker-js/faker";
import { Prisma, AttributeDataType, AttributeInputType } from "@prisma/client";

export function createAttribute(): Prisma.AttributeCreateInput {
  return {
    code: faker.string.alphanumeric(8).toLowerCase(),
    label: faker.commerce.productMaterial(),
    dataType: faker.helpers.arrayElement(Object.values(AttributeDataType)),
    inputType: faker.helpers.arrayElement(Object.values(AttributeInputType)),
    isRequired: faker.datatype.boolean(),
    isFilterable: faker.datatype.boolean(),
    isGlobal: faker.datatype.boolean(),
  };
}
