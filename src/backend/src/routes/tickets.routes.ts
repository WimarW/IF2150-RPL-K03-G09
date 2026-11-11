import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadFoto } from '../middlewares/upload.middleware';
import { TiketLaporanController as T } from '../controllers/TiketLaporanController';

const router = Router();
const pelapor = authorizeRoles(Role.PELANGGAN, Role.PEMBERI_JASA);

/**
 * UC08 Melaporkan Masalah (KF14-KF16)
 * - POST /api/tickets              buat tiket (multipart: jenisTiket, keteranganTiket, bukti)
 * - GET  /api/tickets/mine         daftar tiket milik pelapor
 * - GET  /api/tickets/:id          detail + percakapan (pelapor / CS)
 * - POST /api/tickets/:id/messages pelapor membalas di ruang mediasi
 */
router.post('/', authenticateJWT, pelapor, uploadFoto('bukti'), T.buatTiket);
router.get('/mine', authenticateJWT, pelapor, T.tiketSaya);
router.get('/:id', authenticateJWT, T.detailTiket);
router.post('/:id/messages', authenticateJWT, pelapor, uploadFoto('lampiran'), T.kirimPesanPelapor);

export default router;
