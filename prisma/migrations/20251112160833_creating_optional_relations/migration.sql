/*
  Warnings:

  - The primary key for the `ProductAsset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[productId,assetId,type]` on the table `ProductAsset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,categoryId]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."CategoryTranslation" DROP CONSTRAINT "CategoryTranslation_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CategoryTranslation" DROP CONSTRAINT "CategoryTranslation_storeViewId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductAsset" DROP CONSTRAINT "ProductAsset_assetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductAsset" DROP CONSTRAINT "ProductAsset_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductAttributeValue" DROP CONSTRAINT "ProductAttributeValue_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductAttributeValue" DROP CONSTRAINT "ProductAttributeValue_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductCategory" DROP CONSTRAINT "ProductCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProductCategory" DROP CONSTRAINT "ProductCategory_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StoreView" DROP CONSTRAINT "StoreView_storeId_fkey";

-- AlterTable
ALTER TABLE "CategoryTranslation" ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "storeViewId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductAsset" DROP CONSTRAINT "ProductAsset_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL,
ALTER COLUMN "assetId" DROP NOT NULL,
ADD CONSTRAINT "ProductAsset_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductAttributeValue" ALTER COLUMN "productId" DROP NOT NULL,
ALTER COLUMN "attributeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL,
ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StoreView" ALTER COLUMN "storeId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductAsset_productId_assetId_type_key" ON "ProductAsset"("productId", "assetId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_productId_categoryId_key" ON "ProductCategory"("productId", "categoryId");

-- AddForeignKey
ALTER TABLE "ProductAsset" ADD CONSTRAINT "ProductAsset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAsset" ADD CONSTRAINT "ProductAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_storeViewId_fkey" FOREIGN KEY ("storeViewId") REFERENCES "StoreView"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreView" ADD CONSTRAINT "StoreView_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
