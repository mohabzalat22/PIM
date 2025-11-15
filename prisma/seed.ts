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

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // await prisma.$transaction([
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

  for (let i = 0; i < 50; i++) {
    const store = await prisma.store.create({ data: createStore() });
    const storeView = await prisma.storeView.create({
      data: createStoreView(store.id),
    });

    const category = await prisma.category.create({ data: createCategory() });
    await prisma.categoryTranslation.create({
      data: createCategoryTranslation(category.id, storeView.id),
    });

    const product = await prisma.product.create({ data: createProduct() });
    const asset = await prisma.asset.create({ data: createAsset() });
    await prisma.productAsset.create({
      data: createProductAsset(product.id, asset.id),
    });

    await prisma.productCategory.create({
      data: createProductCategory(product.id, category.id),
    });

    const attribute = await prisma.attribute.create({
      data: createAttribute(),
    });
    await prisma.productAttributeValue.create({
      data: createProductAttributeValue(product.id, attribute.id, storeView.id),
    });
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
