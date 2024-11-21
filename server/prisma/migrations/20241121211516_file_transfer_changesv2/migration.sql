/*
  Warnings:

  - The `size` column on the `fileTransfer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "fileTransfer" DROP COLUMN "size",
ADD COLUMN     "size" INTEGER NOT NULL DEFAULT 0;
