/*
  Warnings:

  - A unique constraint covering the columns `[attributeSetId,attributeId]` on the table `AttributeSetGroupAttribute` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."AttributeGroup" DROP CONSTRAINT "AttributeGroup_attributeSetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AttributeSetAttribute" DROP CONSTRAINT "AttributeSetAttribute_attributeSetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AttributeSetGroupAttribute" DROP CONSTRAINT "AttributeSetGroupAttribute_attributeGroupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AttributeSetGroupAttribute" DROP CONSTRAINT "AttributeSetGroupAttribute_attributeSetId_fkey";

-- DropIndex
DROP INDEX "public"."AttributeSetGroupAttribute_attributeGroupId_attributeId_key";

-- AlterTable
ALTER TABLE "AttributeGroup" ALTER COLUMN "attributeSetId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AttributeSetAttribute" ALTER COLUMN "attributeSetId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AttributeSetGroupAttribute" ALTER COLUMN "attributeGroupId" DROP NOT NULL,
ALTER COLUMN "attributeSetId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AttributeSetGroupAttribute_attributeSetId_attributeId_key" ON "AttributeSetGroupAttribute"("attributeSetId", "attributeId");

-- AddForeignKey
ALTER TABLE "AttributeGroup" ADD CONSTRAINT "AttributeGroup_attributeSetId_fkey" FOREIGN KEY ("attributeSetId") REFERENCES "AttributeSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeSetAttribute" ADD CONSTRAINT "AttributeSetAttribute_attributeSetId_fkey" FOREIGN KEY ("attributeSetId") REFERENCES "AttributeSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeSetGroupAttribute" ADD CONSTRAINT "AttributeSetGroupAttribute_attributeGroupId_fkey" FOREIGN KEY ("attributeGroupId") REFERENCES "AttributeGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeSetGroupAttribute" ADD CONSTRAINT "AttributeSetGroupAttribute_attributeSetId_fkey" FOREIGN KEY ("attributeSetId") REFERENCES "AttributeSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
