import { Router } from 'express';
import { PenggunaController } from '../controllers/PenggunaController';
import { authenticateJWT } from '../middlewares/auth.middleware';

const usersRouter = Router();

usersRouter.get('/profile', authenticateJWT, PenggunaController.getProfile);
usersRouter.put('/profile', authenticateJWT, PenggunaController.updateProfile);

export default usersRouter;
