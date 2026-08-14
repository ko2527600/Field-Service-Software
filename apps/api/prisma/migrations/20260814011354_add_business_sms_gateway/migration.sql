-- CreateEnum
CREATE TYPE "SmsGateway" AS ENUM ('CAPCOM6', 'HUBTEL');

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "smsGateway" "SmsGateway" NOT NULL DEFAULT 'CAPCOM6';
