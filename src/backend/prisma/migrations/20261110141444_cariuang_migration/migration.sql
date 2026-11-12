/*
  Warnings:

  - The `status_baca` column on the `notifikasi` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "notifikasi" DROP COLUMN "status_baca",
ADD COLUMN     "status_baca" BOOLEAN NOT NULL DEFAULT false;
