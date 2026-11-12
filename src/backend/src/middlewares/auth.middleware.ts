import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

export interface JwtUserPayload {
    idPengguna: string;
    username: string;
    role: Role;
    iat?: number;
    exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
        throw new Error('FATAL: JWT_SECRET environment variable tidak terdefinisi.');
        }
        return 'dev_fallback_secret_cariuang_2026_ChangeInProd';
    }
    return secret;
};

export const authenticateJWT = (req: Request, res: Response,next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token autentikasi tidak ditemukan atau format tidak valid.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token tidak disertakan.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtUserPayload;
    req.user = {
      idPengguna: decoded.idPengguna,
      username: decoded.username,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Sesi Anda telah berakhir. Silakan login kembali.',
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Token autentikasi tidak valid.',
    });
  }
};


export const authorizeRoles = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
        res.status(401).json({
            success: false,
            message: 'Pengguna belum terautentikasi.',
        });
        return;
        }

        if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
            success: false,
            message: `Akses terlarang. Peran ${req.user.role} tidak memiliki izin untuk mengakses sumber daya ini.`,
        });
        return;
        }

        next();
    };
};
