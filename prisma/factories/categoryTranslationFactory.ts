import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createCategoryTranslation(
  categoryId: number,
  storeViewId: number
): Prisma.CategoryTranslationCreateInput {
  return {
    category: { connect: { id: categoryId } },
    storeView: { connect: { id: storeViewId } },
    name: faker.commerce.department(),
    slug: faker.helpers.slugify(faker.commerce.department().toLowerCase()),
    description: faker.commerce.productDescription(),
  };
}
