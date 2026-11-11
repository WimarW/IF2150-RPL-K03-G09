import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

export const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png']);
export const MAX_FILE_BYTES = 5 * 1024 * 1024; // KF: maksimal 5 MB

const uploader = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) =>
      cb(null, crypto.randomUUID() + (file.mimetype === 'image/png' ? '.png' : '.jpg')),
  }),
  limits: { fileSize: MAX_FILE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) =>
    ALLOWED_MIME.has(file.mimetype) ? cb(null, true) : cb(new Error('FORMAT_FOTO_TIDAK_VALID')),
});

/** Upload 1 foto (JPG/PNG <= 5MB) dengan error berformat { success, message }. */
export const uploadFoto = (field: string) => (req: Request, res: Response, next: NextFunction): void => {
  uploader.single(field)(req, res, (err: unknown) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ success: false, message: 'Ukuran foto maksimal 5MB.' });
      return;
    }
    if (err instanceof Error && err.message === 'FORMAT_FOTO_TIDAK_VALID') {
      res.status(400).json({ success: false, message: 'Format foto harus JPG atau PNG.' });
      return;
    }
    res.status(400).json({ success: false, message: 'Gagal mengunggah file.' });
  });
};
