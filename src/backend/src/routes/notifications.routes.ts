import { Router } from 'express';
import { NotifikasiController } from '../controllers/NotifikasiController';
import { requireAuthStub } from './chats.routes';

export function createNotificationsRouter(controller?: NotifikasiController): Router {
  const router = Router();
  const notifikasiController = controller ?? new NotifikasiController();

  router.use(requireAuthStub);

  router.get('/', notifikasiController.getNotificationsHandler);
  // /read-all didaftarkan sebelum /:id/read
  router.patch('/read-all', notifikasiController.markAllNotificationsReadHandler);
  router.patch('/:id/read', notifikasiController.markOneNotificationReadHandler);

  return router;
}

const notificationsRouter = createNotificationsRouter();
export default notificationsRouter;