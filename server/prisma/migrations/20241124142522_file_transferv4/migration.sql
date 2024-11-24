/*
  Warnings:

  - You are about to drop the column `progress` on the `fileTransfer` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FileVerificationStatus" AS ENUM ('PENDING', 'FAILED', 'SUCCESS');

-- AlterTable
ALTER TABLE "fileTransfer" DROP COLUMN "progress",
ADD COLUMN     "completion_progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deletion_status" "FileVerificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "verfication_status" "FileVerificationStatus" NOT NULL DEFAULT 'PENDING';
