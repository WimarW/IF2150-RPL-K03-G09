/*
  Warnings:

  - A unique constraint covering the columns `[id_kontrak_pekerjaan,id_pengguna_pemberi]` on the table `rating` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "rating_id_kontrak_pekerjaan_key";

-- CreateIndex
CREATE UNIQUE INDEX "rating_id_kontrak_pekerjaan_id_pengguna_pemberi_key" ON "rating"("id_kontrak_pekerjaan", "id_pengguna_pemberi");
