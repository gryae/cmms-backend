-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "branch" TEXT,
ADD COLUMN     "code" TEXT,
ADD COLUMN     "procurementYear" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ALTER COLUMN "category" DROP NOT NULL;
