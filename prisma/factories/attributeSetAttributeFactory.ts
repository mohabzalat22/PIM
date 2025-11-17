import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createAttributeSetAttribute(
  attributeSetId: number,
  attributeId: number
): Prisma.AttributeSetAttributeCreateInput {
  return {
    attributeSet: { connect: { id: attributeSetId } },
    attribute: { connect: { id: attributeId } },
    sortOrder: faker.number.int({ min: 0, max: 100 }),
  };
}
