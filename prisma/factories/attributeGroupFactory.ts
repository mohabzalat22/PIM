import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createAttributeGroup(
  attributeSetId: number
): Prisma.AttributeGroupCreateInput {
  return {
    attributeSet: { connect: { id: attributeSetId } },
    code: faker.string.alphanumeric(8).toLowerCase(),
    label: faker.commerce.department(),
    sortOrder: faker.number.int({ min: 0, max: 100 }),
  };
}
