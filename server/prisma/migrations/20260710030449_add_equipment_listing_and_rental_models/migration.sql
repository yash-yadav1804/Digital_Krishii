-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'MAINTENANCE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "EquipmentPriceUnit" AS ENUM ('PER_HOUR', 'PER_DAY', 'PER_WEEK', 'PER_MONTH');

-- CreateEnum
CREATE TYPE "EquipmentRentalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "EquipmentListing" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "equipmentType" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "modelName" TEXT,
    "condition" TEXT,
    "rentPrice" DECIMAL(12,2) NOT NULL,
    "priceUnit" "EquipmentPriceUnit" NOT NULL,
    "imageUrl" TEXT,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "address" TEXT,
    "district" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentRental" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "message" TEXT,
    "status" "EquipmentRentalStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(12,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentRental_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EquipmentListing_ownerId_idx" ON "EquipmentListing"("ownerId");

-- CreateIndex
CREATE INDEX "EquipmentListing_equipmentType_idx" ON "EquipmentListing"("equipmentType");

-- CreateIndex
CREATE INDEX "EquipmentListing_status_idx" ON "EquipmentListing"("status");

-- CreateIndex
CREATE INDEX "EquipmentListing_district_idx" ON "EquipmentListing"("district");

-- CreateIndex
CREATE INDEX "EquipmentRental_equipmentId_idx" ON "EquipmentRental"("equipmentId");

-- CreateIndex
CREATE INDEX "EquipmentRental_requesterId_idx" ON "EquipmentRental"("requesterId");

-- CreateIndex
CREATE INDEX "EquipmentRental_status_idx" ON "EquipmentRental"("status");

-- AddForeignKey
ALTER TABLE "EquipmentListing" ADD CONSTRAINT "EquipmentListing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRental" ADD CONSTRAINT "EquipmentRental_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "EquipmentListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentRental" ADD CONSTRAINT "EquipmentRental_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
