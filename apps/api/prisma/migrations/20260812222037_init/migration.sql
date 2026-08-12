-- CreateEnum
CREATE TYPE "RenewalPeriod" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ExtinguisherType" AS ENUM ('ABC_DRY_CHEMICAL', 'CO2', 'WATER', 'FOAM', 'WET_CHEMICAL', 'CLASS_D', 'OTHER');

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "businessType" TEXT,
    "notes" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "ExtinguisherType" NOT NULL,
    "size" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "installDate" TIMESTAMP(3) NOT NULL,
    "renewalPeriod" "RenewalPeriod" NOT NULL,
    "customIntervalDays" INTEGER,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_logs" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "technician" TEXT,
    "amountCharged" DECIMAL(10,2),
    "notes" TEXT,
    "nextDueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customers_businessId_idx" ON "customers"("businessId");

-- CreateIndex
CREATE INDEX "units_customerId_idx" ON "units"("customerId");

-- CreateIndex
CREATE INDEX "units_renewalDate_idx" ON "units"("renewalDate");

-- CreateIndex
CREATE INDEX "service_logs_unitId_idx" ON "service_logs"("unitId");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_logs" ADD CONSTRAINT "service_logs_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE;
