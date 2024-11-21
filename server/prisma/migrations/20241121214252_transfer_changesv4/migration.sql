-- AlterTable
ALTER TABLE "fileTransfer" ALTER COLUMN "size" SET DEFAULT '0',
ALTER COLUMN "size" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "transfers" ALTER COLUMN "transferSize" SET DEFAULT '0',
ALTER COLUMN "transferSize" SET DATA TYPE TEXT;
