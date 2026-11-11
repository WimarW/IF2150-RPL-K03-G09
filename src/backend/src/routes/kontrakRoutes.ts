import { Router } from 'express';
import { Role } from '@prisma/client';
import {
  KontrakPekerjaanController,
  kontrakPekerjaanController,
} from '../controllers/KontrakPekerjaanController';
import {
  authenticateJWT,
  authorizeRoles,
} from '../middlewares/auth.middleware';

export function createKontrakRouter(
  controller: KontrakPekerjaanController = kontrakPekerjaanController
): Router {
  const router = Router();

  /**
   * UC05 & KF10 (KNF17): Menampilkan template form pembuatan kontrak kesepakatan
   */
  router.get(
    '/form',
    authenticateJWT,
    authorizeRoles(Role.PELANGGAN),
    controller.handleShowKontrakForm
  );

  /**
   * Integrasi Ruang Obrolan (UC03, UC04, UC05):
   * Mengambil kontrak aktif & riwayat chat antara pengguna dan lawan bicara
   */
  router.get(
    '/chat/:idLawanBicara',
    authenticateJWT,
    controller.handleGetKontrakByChatPartner
  );

  /**
   * Mengambil daftar riwayat kontrak pengguna yang sedang login (UI-10 & UI-12)
   */
  router.get('/', authenticateJWT, controller.handleGetDaftarKontrak);

  /**
   * UC05 (KF02, KF10, KF11, KNF04, KNF18, KNF19 | ALGO-037, ALGO-038, ALGO-039, ALGO-043 | Q-017):
   * Pelanggan membuat kontrak kesepakatan pekerjaan & harga -> status 'Menunggu' + Optimistic Lock penyedia jasa
   */
  router.post(
    '/',
    authenticateJWT,
    authorizeRoles(Role.PELANGGAN),
    controller.handleKirimInput
  );

  /**
   * ALGO-040 & ALGO-041 (Q-019): Mengambil detail kontrak pekerjaan berdasarkan ID
   */
  router.get('/:id', authenticateJWT, controller.handleGetKontrakById);

  /**
   * UC04/UC05 (KF11, KNF04, KNF19, KNF22 | ALGO-036, ALGO-037 | Q-016, Q-018):
   * Penyedia jasa menerima atau menolak kontrak dengan Optimistic Locking (version check)
   */
  router.patch(
    '/:id/persetujuan',
    authenticateJWT,
    authorizeRoles(Role.PEMBERI_JASA),
    controller.handleKonfirmasiPersetujuan
  );

  router.post(
    '/:id/terima',
    authenticateJWT,
    authorizeRoles(Role.PEMBERI_JASA),
    controller.handleTerimaKontrak
  );

  router.patch(
    '/:id/terima',
    authenticateJWT,
    authorizeRoles(Role.PEMBERI_JASA),
    controller.handleTerimaKontrak
  );

  router.post(
    '/:id/tolak',
    authenticateJWT,
    authorizeRoles(Role.PEMBERI_JASA),
    controller.handleTolakKontrak
  );

  router.patch(
    '/:id/tolak',
    authenticateJWT,
    authorizeRoles(Role.PEMBERI_JASA),
    controller.handleTolakKontrak
  );

  /**
   * UC06 (KF12, KNF20, KNF22 | ALGO-036 | Q-016):
   * Penyedia jasa menyelesaikan pekerjaan -> status menjadi 'Menunggu Konfirmasi Pelanggan' + kirim notifikasi
   */
  router.patch(
    '/:id/selesai',
    authenticateJWT,
    authorizeRoles(Role.PEMBERI_JASA),
    controller.handleSelesaikanPekerjaan
  );

  router.post(
    '/:id/selesai',
    authenticateJWT,
    authorizeRoles(Role.PEMBERI_JASA),
    controller.handleSelesaikanPekerjaan
  );

  /**
   * UC07 (KF13, KNF21, KNF22 | ALGO-042 | Q-016 | C01 Pengguna.konfirmasiPekerjaan):
   * Pelanggan mengonfirmasi penyelesaian & pembayaran -> status menjadi 'Done' + buka kunci penyedia jasa
   */
  router.patch(
    '/:id/konfirmasi',
    authenticateJWT,
    authorizeRoles(Role.PELANGGAN),
    controller.handleKonfirmasiPekerjaan
  );

  router.post(
    '/:id/konfirmasi',
    authenticateJWT,
    authorizeRoles(Role.PELANGGAN),
    controller.handleKonfirmasiPekerjaan
  );

  return router;
}

const router = createKontrakRouter();
export default router;
