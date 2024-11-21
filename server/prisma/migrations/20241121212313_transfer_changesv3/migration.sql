/*
  Warnings:

  - You are about to drop the column `ToAccountId` on the `transfers` table. All the data in the column will be lost.
  - Added the required column `toAccountId` to the `transfers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_ToAccountId_fkey";

-- AlterTable
ALTER TABLE "fileTransfer" ALTER COLUMN "size" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "transfers" DROP COLUMN "ToAccountId",
ADD COLUMN     "toAccountId" TEXT NOT NULL,
ALTER COLUMN "transferSize" SET DEFAULT 0,
ALTER COLUMN "transferSize" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
