-- CreateEnum
CREATE TYPE "ReviewTargetType" AS ENUM ('CONTRACT_REQUEST', 'EQUIPMENT_RENTAL');

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "revieweeId" TEXT NOT NULL,
    "targetType" "ReviewTargetType" NOT NULL,
    "contractRequestId" TEXT,
    "equipmentRentalId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_reviewerId_idx" ON "Review"("reviewerId");

-- CreateIndex
CREATE INDEX "Review_revieweeId_idx" ON "Review"("revieweeId");

-- CreateIndex
CREATE INDEX "Review_targetType_idx" ON "Review"("targetType");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewerId_contractRequestId_key" ON "Review"("reviewerId", "contractRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewerId_equipmentRentalId_key" ON "Review"("reviewerId", "equipmentRentalId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_contractRequestId_fkey" FOREIGN KEY ("contractRequestId") REFERENCES "ContractRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_equipmentRentalId_fkey" FOREIGN KEY ("equipmentRentalId") REFERENCES "EquipmentRental"("id") ON DELETE CASCADE ON UPDATE CASCADE;
