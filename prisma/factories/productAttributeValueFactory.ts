import { faker } from "@faker-js/faker";
import { Prisma } from "@prisma/client";

export function createProductAttributeValue(
  productId: number,
  attributeId: number,
  storeViewId?: number
): Prisma.ProductAttributeValueCreateInput {
  const data: Prisma.ProductAttributeValueCreateInput = {
    product: { connect: { id: productId } },
    attribute: { connect: { id: attributeId } },
    valueString: faker.commerce.productAdjective(),
    valueInt: faker.number.int({ min: 1, max: 100 }),
    valueDecimal: new Prisma.Decimal(faker.number.float({ min: 1, max: 999 })),
    valueText: faker.commerce.productDescription(),
    valueBoolean: faker.datatype.boolean(),
    valueJson: { extra: faker.commerce.productAdjective() },
  };

  if (storeViewId) {
    data.storeView = { connect: { id: storeViewId } };
  }

  return data;
}
