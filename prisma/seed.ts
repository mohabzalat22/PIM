import { PrismaClient } from "@prisma/client";
import { createStore } from "./factories/storeFactory.js";
import { createStoreView } from "./factories/storeViewFactory.js";
import { createCategory } from "./factories/categoryFactory.js";
import { createCategoryTranslation } from "./factories/categoryTranslationFactory.js";
import { createProduct } from "./factories/productFactory.js";
import { createAsset } from "./factories/assetFactory.js";
import { createProductAsset } from "./factories/productAssetFactory.js";
import { createProductCategory } from "./factories/productCategoryFactory.js";
import { createAttribute } from "./factories/attributeFactory.js";
import { createProductAttributeValue } from "./factories/productAttributeValueFactory.js";
import { createLocale } from "./factories/localeFactory.js";
import { createAttributeSet } from "./factories/attributeSetFactory.js";
import { createAttributeGroup } from "./factories/attributeGroupFactory.js";
import { createAttributeSetAttribute } from "./factories/attributeSetAttributeFactory.js";
import { createAttributeSetGroupAttribute } from "./factories/attributeSetGroupAttributeFactory.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Uncomment to clear data before seeding
  // await prisma.$transaction([
  //   prisma.attributeSetGroupAttribute.deleteMany(),
  //   prisma.attributeSetAttribute.deleteMany(),
  //   prisma.attributeGroup.deleteMany(),
  //   prisma.attributeSet.deleteMany(),
  //   prisma.productAttributeValue.deleteMany(),
  //   prisma.productAsset.deleteMany(),
  //   prisma.productCategory.deleteMany(),
  //   prisma.asset.deleteMany(),
  //   prisma.categoryTranslation.deleteMany(),
  //   prisma.category.deleteMany(),
  //   prisma.attribute.deleteMany(),
  //   prisma.storeView.deleteMany(),
  //   prisma.store.deleteMany(),
  //   prisma.product.deleteMany(),
  //   prisma.locale.deleteMany(),
  // ]);

  // Seed locales (used across store views and frontend filters)
  const locales = [
    { value: "en_US", label: "English (US)" },
    { value: "en_GB", label: "English (UK)" },
    { value: "es_ES", label: "Spanish (Spain)" },
    { value: "fr_FR", label: "French (France)" },
    { value: "de_DE", label: "German (Germany)" },
    { value: "it_IT", label: "Italian (Italy)" },
    { value: "pt_BR", label: "Portuguese (Brazil)" },
    { value: "ja_JP", label: "Japanese (Japan)" },
    { value: "ko_KR", label: "Korean (Korea)" },
    { value: "zh_CN", label: "Chinese (China)" },
  ];

  await prisma.locale.createMany({
    data: locales,
    skipDuplicates: true,
  });

  console.log("✅ Created locales");

  // Create some reusable attributes
  const attributes = [];
  for (let i = 0; i < 10; i++) {
    const attribute = await prisma.attribute.create({
      data: createAttribute(),
    });
    attributes.push(attribute);
  }
  console.log("✅ Created attributes");

  // Create attribute sets with groups and relations
  const attributeSets = [];
  for (let i = 0; i < 5; i++) {
    const attributeSet = await prisma.attributeSet.create({
      data: createAttributeSet(),
    });
    attributeSets.push(attributeSet);

    // Create attribute groups for each set
    const attributeGroup = await prisma.attributeGroup.create({
      data: createAttributeGroup(attributeSet.id),
    });

    // Add some attributes to the set (without group)
    for (let j = 0; j < 2; j++) {
      const attr = attributes[j % attributes.length];
      if (attr) {
        await prisma.attributeSetAttribute.create({
          data: createAttributeSetAttribute(attributeSet.id, attr.id),
        });
      }
    }

    // Add some attributes to the set with group
    for (let k = 0; k < 3; k++) {
      const attr = attributes[(k + 2) % attributes.length];
      if (attr) {
        await prisma.attributeSetGroupAttribute.create({
          data: createAttributeSetGroupAttribute(
            attributeSet.id,
            attr.id,
            attributeGroup.id
          ),
        });
      }
    }
  }
  console.log("✅ Created attribute sets with groups and relations");

  // Main seeding loop
  for (let i = 0; i < 50; i++) {
    const store = await prisma.store.create({ data: createStore() });
    const storeView = await prisma.storeView.create({
      data: createStoreView(store.id),
    });

    const category = await prisma.category.create({ data: createCategory() });
    await prisma.categoryTranslation.create({
      data: createCategoryTranslation(category.id, storeView.id),
    });

    // Create product with attribute set
    const attributeSet = attributeSets[i % attributeSets.length];
    const productData = createProduct();
    const product = await prisma.product.create({
      data: attributeSet
        ? { ...productData, attributeSet: { connect: { id: attributeSet.id } } }
        : productData,
    });

    const asset = await prisma.asset.create({ data: createAsset() });
    await prisma.productAsset.create({
      data: createProductAsset(product.id, asset.id),
    });

    await prisma.productCategory.create({
      data: createProductCategory(product.id, category.id),
    });

    // Create product attribute values
    const attr = attributes[i % attributes.length];
    if (attr) {
      await prisma.productAttributeValue.create({
        data: createProductAttributeValue(product.id, attr.id, storeView.id),
      });
    }

    if ((i + 1) % 10 === 0) {
      console.log(`✅ Created ${i + 1}/50 products with related data`);
    }
  }
  
  console.log("✅ Seed completed successfully!");
} // simple 50 record loop
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
