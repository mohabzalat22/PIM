import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createStoreView(storeId: number): Prisma.StoreViewCreateInput {
  return {
    store: { connect: { id: storeId } },
    code: faker.string.alphanumeric(5).toLowerCase(),
    name: faker.location.city(),
    locale: faker.helpers.arrayElement(["en_US", "ar_EG", "fr_FR"]),
  };
}
