-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CLIENT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ADMIN';

-- CreateIndex
CREATE INDEX "users_customerId_idx" ON "users"("customerId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
