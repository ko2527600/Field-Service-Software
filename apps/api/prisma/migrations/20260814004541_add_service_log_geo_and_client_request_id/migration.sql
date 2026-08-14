-- AlterTable
ALTER TABLE "service_logs" ADD COLUMN     "clientRequestId" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "locationCapturedAt" TIMESTAMP(3),
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "service_logs_clientRequestId_key" ON "service_logs"("clientRequestId");
