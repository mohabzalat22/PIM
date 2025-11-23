-- CreateTable
CREATE TABLE "ProductWorkflowHistory" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "fromStatus" "ProductStatus",
    "toStatus" "ProductStatus" NOT NULL,
    "changedById" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductWorkflowHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductWorkflowHistory_productId_idx" ON "ProductWorkflowHistory"("productId");

-- CreateIndex
CREATE INDEX "ProductWorkflowHistory_createdAt_idx" ON "ProductWorkflowHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "ProductWorkflowHistory" ADD CONSTRAINT "ProductWorkflowHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductWorkflowHistory" ADD CONSTRAINT "ProductWorkflowHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
