-- AlterTable
ALTER TABLE "WorkOrder" ADD COLUMN     "completedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
