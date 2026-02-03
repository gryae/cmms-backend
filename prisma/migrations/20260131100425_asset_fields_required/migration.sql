/*
  Warnings:

  - Made the column `location` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `branch` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `procurementYear` on table `Asset` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Asset` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "branch" SET NOT NULL,
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "procurementYear" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
