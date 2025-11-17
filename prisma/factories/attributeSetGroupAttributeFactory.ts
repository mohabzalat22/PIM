import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createAttributeSetGroupAttribute(
  attributeSetId: number,
  attributeId: number,
  attributeGroupId?: number
): Prisma.AttributeSetGroupAttributeCreateInput {
  const data: Prisma.AttributeSetGroupAttributeCreateInput = {
    attributeSet: { connect: { id: attributeSetId } },
    attribute: { connect: { id: attributeId } },
    sortOrder: faker.number.int({ min: 0, max: 100 }),
  };

  if (attributeGroupId) {
    data.attributeGroup = { connect: { id: attributeGroupId } };
  }

  return data;
}
