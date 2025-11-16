/*
  Warnings:

  - Made the column `attributeSetId` on table `AttributeGroup` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."AttributeGroup" DROP CONSTRAINT "AttributeGroup_attributeSetId_fkey";

-- AlterTable
ALTER TABLE "AttributeGroup" ALTER COLUMN "attributeSetId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AttributeGroup" ADD CONSTRAINT "AttributeGroup_attributeSetId_fkey" FOREIGN KEY ("attributeSetId") REFERENCES "AttributeSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
