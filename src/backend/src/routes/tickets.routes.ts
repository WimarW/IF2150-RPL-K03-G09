import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadFoto } from '../middlewares/upload.middleware';
import { TiketLaporanController } from '../controllers/TiketLaporanController';
import { NotifikasiController } from '../controllers/NotifikasiController';

/**
 * UC08 Melaporkan Masalah (KF14-KF16)
 * - POST /api/tickets              buat tiket (multipart: jenisTiket, keteranganTiket, bukti)
 * - GET  /api/tickets/mine         daftar tiket milik pelapor
 * - GET  /api/tickets/:id          detail + percakapan (pelapor / CS)
 * - POST /api/tickets/:id/messages pelapor membalas di ruang mediasi
 */
export function createTicketsRouter(notifikasi?: NotifikasiController): Router {
  const router = Router();
  const c = new TiketLaporanController(notifikasi);
  const pelapor = authorizeRoles(Role.PELANGGAN, Role.PEMBERI_JASA);

  router.post('/', authenticateJWT, pelapor, uploadFoto('bukti'), c.buatTiketHandler);
  router.get('/mine', authenticateJWT, pelapor, c.tiketSayaHandler);
  router.get('/:id', authenticateJWT, c.detailTiketHandler);
  router.post('/:id/messages', authenticateJWT, pelapor, uploadFoto('lampiran'), c.kirimPesanPelaporHandler);
  return router;
}

export default createTicketsRouter();
