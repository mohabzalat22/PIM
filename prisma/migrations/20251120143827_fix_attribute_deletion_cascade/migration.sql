-- DropForeignKey
ALTER TABLE "public"."AttributeSetAttribute" DROP CONSTRAINT "AttributeSetAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AttributeSetGroupAttribute" DROP CONSTRAINT "AttributeSetGroupAttribute_attributeId_fkey";

-- AddForeignKey
ALTER TABLE "AttributeSetAttribute" ADD CONSTRAINT "AttributeSetAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeSetGroupAttribute" ADD CONSTRAINT "AttributeSetGroupAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
