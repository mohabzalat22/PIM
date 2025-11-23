-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ENRICHMENT', 'VALIDATION', 'APPROVAL', 'PUBLISHING');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "assignedTo" INTEGER,
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT';

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
