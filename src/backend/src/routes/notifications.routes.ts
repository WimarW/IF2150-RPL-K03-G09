import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { TiketLaporanController as T } from '../controllers/TiketLaporanController';

const router = Router();
router.get('/', authenticateJWT, T.daftarNotifikasi);
router.patch('/:id/read', authenticateJWT, T.bacaNotifikasi);
export default router;
