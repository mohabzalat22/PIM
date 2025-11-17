/*
  Warnings:

  - You are about to drop the column `locale` on the `StoreView` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[localeId]` on the table `StoreView` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `localeId` to the `StoreView` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoreView" DROP COLUMN "locale",
ADD COLUMN     "localeId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StoreView_localeId_key" ON "StoreView"("localeId");

-- AddForeignKey
ALTER TABLE "StoreView" ADD CONSTRAINT "StoreView_localeId_fkey" FOREIGN KEY ("localeId") REFERENCES "Locale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
