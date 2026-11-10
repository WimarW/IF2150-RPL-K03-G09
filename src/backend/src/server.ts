import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes';
import usersRouter from './routes/user.routes';
import servicesRoutes from './routes/services.routes';
import ticketsRouter from './routes/tickets.routes';
import csRouter from './routes/cs.routes';
import notificationsRouter from './routes/notifications.routes';
import { UPLOAD_DIR } from './middlewares/upload.middleware';
import { KategoriJasaController } from './controllers/KategoriJasaController';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const kategoriJasaController = new KategoriJasaController();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Tiket laporan & Layanan Pelanggan (UC08, UC09)
app.use('/api/tickets', ticketsRouter);
app.use('/api/cs', csRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/uploads', express.static(UPLOAD_DIR)); // produksi: tambahkan auth / signed URL

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Mount Route Katalog & Pencarian Jasa
app.use('/api/services', servicesRoutes);

// Alias langsung untuk /api/categories
app.get('/api/categories', kategoriJasaController.getAllCategoriesHandler);
app.get('/api/categories/:id', kategoriJasaController.getCategoryByIdHandler);
app.post('/api/categories', kategoriJasaController.createCategoryAndBindServiceHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[server]: Backend running at http://localhost:${port}`);
  });
}

export default app;
