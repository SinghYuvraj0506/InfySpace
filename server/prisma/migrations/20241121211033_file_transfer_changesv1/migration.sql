/*
  Warnings:

  - You are about to drop the column `files` on the `transfers` table. All the data in the column will be lost.
  - Added the required column `transferSize` to the `transfers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transfers" DROP COLUMN "files",
ADD COLUMN     "transferSize" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "fileTransfer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "initalId" TEXT NOT NULL,
    "finalId" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "size" TEXT NOT NULL,
    "transferId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fileTransfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fileTransfer" ADD CONSTRAINT "fileTransfer_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "transfers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fileTransfer" ADD CONSTRAINT "fileTransfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
