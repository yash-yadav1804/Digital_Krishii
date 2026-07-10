-- CreateEnum
CREATE TYPE "ContractTemplateType" AS ENUM ('MARKET_SPECIFICATION', 'RESOURCE_PROVIDING', 'PRODUCTION_MANAGEMENT', 'SHARED_RISK', 'VERTICAL_INTEGRATION', 'CROP_INSURANCE');

-- CreateEnum
CREATE TYPE "ContractRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "ContractTemplate" (
    "id" TEXT NOT NULL,
    "type" "ContractTemplateType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "pdfUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContractRequest" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "landId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "cropName" TEXT,
    "quantity" TEXT,
    "proposedPrice" DECIMAL(12,2),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "message" TEXT,
    "status" "ContractRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContractTemplate_type_key" ON "ContractTemplate"("type");

-- CreateIndex
CREATE INDEX "ContractRequest_templateId_idx" ON "ContractRequest"("templateId");

-- CreateIndex
CREATE INDEX "ContractRequest_landId_idx" ON "ContractRequest"("landId");

-- CreateIndex
CREATE INDEX "ContractRequest_buyerId_idx" ON "ContractRequest"("buyerId");

-- CreateIndex
CREATE INDEX "ContractRequest_farmerId_idx" ON "ContractRequest"("farmerId");

-- CreateIndex
CREATE INDEX "ContractRequest_status_idx" ON "ContractRequest"("status");

-- AddForeignKey
ALTER TABLE "ContractRequest" ADD CONSTRAINT "ContractRequest_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ContractTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractRequest" ADD CONSTRAINT "ContractRequest_landId_fkey" FOREIGN KEY ("landId") REFERENCES "LandListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractRequest" ADD CONSTRAINT "ContractRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractRequest" ADD CONSTRAINT "ContractRequest_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
