-- CreateEnum
CREATE TYPE "LandListingType" AS ENUM ('CONTRACT_FARMING', 'RENT');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('AVAILABLE', 'PRE_BOOKED', 'UNDER_CONTRACT', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PriceUnit" AS ENUM ('PER_ACRE', 'PER_MONTH');

-- CreateTable
CREATE TABLE "LandListing" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "area" DECIMAL(10,2) NOT NULL,
    "areaUnit" TEXT NOT NULL DEFAULT 'acre',
    "price" DECIMAL(12,2) NOT NULL,
    "priceUnit" "PriceUnit" NOT NULL,
    "listingType" "LandListingType" NOT NULL,
    "imageUrl" TEXT,
    "status" "ListingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "address" TEXT,
    "district" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LandListing_ownerId_idx" ON "LandListing"("ownerId");

-- CreateIndex
CREATE INDEX "LandListing_listingType_idx" ON "LandListing"("listingType");

-- CreateIndex
CREATE INDEX "LandListing_status_idx" ON "LandListing"("status");

-- AddForeignKey
ALTER TABLE "LandListing" ADD CONSTRAINT "LandListing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
