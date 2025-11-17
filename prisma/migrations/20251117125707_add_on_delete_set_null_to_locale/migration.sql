-- DropForeignKey
ALTER TABLE "public"."StoreView" DROP CONSTRAINT "StoreView_localeId_fkey";

-- AlterTable
ALTER TABLE "StoreView" ALTER COLUMN "localeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "StoreView" ADD CONSTRAINT "StoreView_localeId_fkey" FOREIGN KEY ("localeId") REFERENCES "Locale"("id") ON DELETE SET NULL ON UPDATE CASCADE;
