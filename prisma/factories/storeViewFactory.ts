import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createStoreView(
  storeId: number,
  localeId: number
): Prisma.StoreViewCreateInput {
  return {
    store: { connect: { id: storeId } },
    locale: { connect: { id: localeId } },
    code: faker.string.alphanumeric(5).toLowerCase(),
    name: faker.location.city(),
  };
}
