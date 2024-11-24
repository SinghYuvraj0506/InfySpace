-- AlterTable
ALTER TABLE "fileTransfer" ADD COLUMN     "expiry" TIMESTAMP(3),
ADD COLUMN     "uploadUri" TEXT;
