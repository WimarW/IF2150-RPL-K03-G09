import http from 'http';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';

import authRouter from './routes/auth.routes';
import usersRouter from './routes/user.routes';
import servicesRoutes from './routes/services.routes';
import { createChatsRouter } from './routes/chats.routes';
import { createNotificationsRouter } from './routes/notifications.routes';

import { KategoriJasaController } from './controllers/KategoriJasaController';
import { KomunikasiController } from './controllers/KomunikasiController';
import { KontrakPekerjaanController } from './controllers/KontrakPekerjaanController';
import { NotifikasiController, RealtimeEmitter } from './controllers/NotifikasiController';
import { createKontrakRouter } from './routes/kontrakRoutes';
import { startAutoCancelWorker } from './workers/autoCancelKontrakWorker';

dotenv.config();

export class SocketIORealtimeEmitter implements RealtimeEmitter {
  constructor(private readonly io: SocketIOServer) {}

  public emitToUser(idPengguna: string, event: string, payload: unknown): void {
    this.io.to(`user:${idPengguna}`).emit(event, payload);
  }
}

export function createApp(): {
  app: Application;
  httpServer: http.Server;
  io: SocketIOServer;
  komunikasiController: KomunikasiController;
  notifikasiController: NotifikasiController;
  kontrakPekerjaanController: KontrakPekerjaanController;
} {
  const app = express();

  // ---------- Middleware ----------
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ---------- HTTP server + Socket.IO ----------
  const httpServer = http.createServer(app);

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    const userId =
      (socket.handshake.auth?.userId as string | undefined) ??
      (socket.handshake.query?.userId as string | undefined);

    if (userId && typeof userId === 'string' && userId.trim().length > 0) {
      socket.join(`user:${userId.trim()}`);
    }

    socket.on('join:user', (targetUserId: string) => {
      if (targetUserId && typeof targetUserId === 'string' && targetUserId.trim().length > 0) {
        socket.join(`user:${targetUserId.trim()}`);
      }
    });
  });

  // ---------- Controllers ----------
  const realtimeEmitter = new SocketIORealtimeEmitter(io);
  const kategoriJasaController = new KategoriJasaController();
  const notifikasiController = new NotifikasiController(
    undefined,
    undefined,
    realtimeEmitter
  );
  const komunikasiController = new KomunikasiController(
    undefined,
    notifikasiController,
    realtimeEmitter
  );
  const kontrakPekerjaanController = new KontrakPekerjaanController(
    notifikasiController,
    komunikasiController,
    realtimeEmitter
  );

  // ---------- Routes ----------
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  // Mount Route Katalog & Pencarian Jasa
  app.use('/api/services', servicesRoutes);

  // Alias langsung untuk /api/categories
  app.get('/api/categories', kategoriJasaController.getAllCategoriesHandler);
  app.get('/api/categories/:id', kategoriJasaController.getCategoryByIdHandler);
  app.post('/api/categories', kategoriJasaController.createCategoryAndBindServiceHandler);

  // Chat & Notifikasi (realtime)
  app.use('/api/chats', createChatsRouter(komunikasiController));
  app.use('/api/notifications', createNotificationsRouter(notifikasiController));

  // Mount Route Kontrak Pekerjaan (UC05, UC06, UC07) terhubung dengan Notifikasi & Chat
  const kontrakRouter = createKontrakRouter(kontrakPekerjaanController);
  app.use('/api/kontrak', kontrakRouter);
  app.use('/kontrak', kontrakRouter);

  return {
    app,
    httpServer,
    io,
    komunikasiController,
    notifikasiController,
    kontrakPekerjaanController,
  };
}

const { app, httpServer, io, notifikasiController } = createApp();

const port = Number(process.env.PORT) || 5000;

if (process.env.NODE_ENV !== 'test') {
  startAutoCancelWorker(
    60 * 1000,
    notifikasiController,
    new SocketIORealtimeEmitter(io)
  );
  // Wajib pakai httpServer.listen (bukan app.listen) supaya Socket.IO ikut jalan
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`[server]: Backend + Socket.IO running at http://localhost:${port}`);
  });
}

export { app, httpServer, io };
export default app;