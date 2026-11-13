import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadFoto } from '../middlewares/upload.middleware';
import { LayananPelangganCtrl as CS } from '../controllers/LayananPelangganCtrl';

const router = Router();
router.use(authenticateJWT, authorizeRoles(Role.LAYANAN_PELANGGAN));

/**
 * UC09 Layanan Pelanggan merespon laporan (KF17-KF18)
 * - GET  /api/cs/stats
 * - GET  /api/cs/tickets?status=
 * - POST /api/cs/tickets/:id/reply   (multipart: text, lampiran)
 * - POST /api/cs/tickets/:id/close
 */
router.get('/stats', CS.statistik);
router.get('/tickets', CS.daftarTiket);
router.post('/tickets/:id/reply', uploadFoto('lampiran'), CS.balasTiket);
router.post('/tickets/:id/close', CS.tutupTiket);

export default router;
