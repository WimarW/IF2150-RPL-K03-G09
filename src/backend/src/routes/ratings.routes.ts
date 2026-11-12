// backend/src/routes/ratings.routes.ts
import { Router } from 'express';
import { Role } from '@prisma/client';
import { RatingController } from '../controllers/RatingController';
import { PenggunaController } from '../controllers/PenggunaController';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();


router.post(
  '/',
  authenticateJWT,
  authorizeRoles(Role.PELANGGAN, Role.PEMBERI_JASA),
  RatingController.createRating
);

router.get('/user/:id', RatingController.getRatingsByUser);

router.get(
  '/verify/:idKontrak',
  authenticateJWT,
  authorizeRoles(Role.PELANGGAN, Role.PEMBERI_JASA),
  PenggunaController.triggerRating
);

export default router;
