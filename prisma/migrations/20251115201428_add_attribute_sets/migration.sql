-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "attributeSetId" INTEGER;

-- CreateTable
CREATE TABLE "AttributeSet" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "productType" "ProductType",
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributeSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeGroup" (
    "id" SERIAL NOT NULL,
    "attributeSetId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttributeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeSetAttribute" (
    "id" SERIAL NOT NULL,
    "attributeSetId" INTEGER NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AttributeSetAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeSetGroupAttribute" (
    "id" SERIAL NOT NULL,
    "attributeGroupId" INTEGER NOT NULL,
    "attributeSetId" INTEGER NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AttributeSetGroupAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttributeSet_code_key" ON "AttributeSet"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeGroup_attributeSetId_code_key" ON "AttributeGroup"("attributeSetId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeSetAttribute_attributeSetId_attributeId_key" ON "AttributeSetAttribute"("attributeSetId", "attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeSetGroupAttribute_attributeGroupId_attributeId_key" ON "AttributeSetGroupAttribute"("attributeGroupId", "attributeId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_attributeSetId_fkey" FOREIGN KEY ("attributeSetId") REFERENCES "AttributeSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeGroup" ADD CONSTRAINT "AttributeGroup_attributeSetId_fkey" FOREIGN KEY ("attributeSetId") REFERENCES "AttributeSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeSetAttribute" ADD CONSTRAINT "AttributeSetAttribute_attributeSetId_fkey" FOREIGN KEY ("attributeSetId") REFERENCES "AttributeSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeSetAttribute" ADD CONSTRAINT "AttributeSetAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeSetGroupAttribute" ADD CONSTRAINT "AttributeSetGroupAttribute_attributeGroupId_fkey" FOREIGN KEY ("attributeGroupId") REFERENCES "AttributeGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeSetGroupAttribute" ADD CONSTRAINT "AttributeSetGroupAttribute_attributeSetId_fkey" FOREIGN KEY ("attributeSetId") REFERENCES "AttributeSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeSetGroupAttribute" ADD CONSTRAINT "AttributeSetGroupAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
