/*
  Warnings:

  - Changed the type of `transferSize` on the `transfers` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "transfers" DROP COLUMN "transferSize",
ADD COLUMN     "transferSize" INTEGER NOT NULL;
