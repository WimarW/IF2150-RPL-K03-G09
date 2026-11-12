import { Router, Request, Response } from 'express';
import { Role } from '@prisma/client';
import prisma from '../database/prisma';
import jwt from 'jsonwebtoken';

/**
 * KHUSUS DEVELOPMENT - token tanpa password, dipakai frontend selama halaman login belum ada.
 * Hanya aktif bila ENABLE_DEV_TOKEN=true. JANGAN aktifkan di server produksi.
 *
 * POST /api/auth/dev-token  { idPengguna?: string, role?: 'PELANGGAN'|'PEMBERI_JASA'|'LAYANAN_PELANGGAN' }
 * - Bila idPengguna ada dan role-nya cocok, token dibuat untuk pengguna itu.
 * - Bila tidak, dipakai pengguna pertama yang memiliki role tersebut (mis. dari seed).
 */
const router = Router();

router.post('/dev-token', async (req: Request, res: Response) => {
  const { idPengguna, role } = req.body ?? {};
  const roleValid = Object.values(Role).includes(role) ? (role as Role) : undefined;

  let user = idPengguna ? await prisma.pengguna.findUnique({ where: { idPengguna: String(idPengguna) } }) : null;
  if (!user || (roleValid && user.role !== roleValid)) {
    user = await prisma.pengguna.findFirst({ where: { role: roleValid ?? Role.PELANGGAN } });
  }
  if (!user) {
    res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan. Jalankan seed terlebih dahulu.' });
    return;
  }

  const token = jwt.sign(
    { idPengguna: user.idPengguna, username: user.username, role: user.role },
    // sama dengan secret yang dipakai authenticateJWT
    process.env.JWT_SECRET || 'dev_fallback_secret_cariuang_2026_ChangeInProd',
    { expiresIn: '7d' }
  );
  res.json({
    success: true,
    data: { token, user: { idPengguna: user.idPengguna, namaPengguna: user.namaPengguna, username: user.username, role: user.role } },
  });
});

export default router;
