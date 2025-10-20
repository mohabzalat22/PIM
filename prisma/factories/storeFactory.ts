import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createStore(): Prisma.StoreCreateInput {
  return {
    code: faker.string.alphanumeric(5).toLowerCase(),
    name: faker.company.name(),
  };
}
