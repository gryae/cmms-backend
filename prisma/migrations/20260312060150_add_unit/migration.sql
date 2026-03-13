-- CreateEnum
CREATE TYPE "unit" AS ENUM ('TK', 'SD', 'SMP', 'SMA', 'NonUnit');

-- AlterTable
ALTER TABLE "WorkOrder" ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'NonUnit';
