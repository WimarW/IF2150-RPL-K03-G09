import crypto from 'crypto';
import { NextFunction, Request, Response, Router } from 'express';
import { KomunikasiController } from '../controllers/KomunikasiController';

export interface AuthenticatedRequest extends Omit<Request, 'user'> {
  user?: {
    idPengguna: string;
    username?: string;
    role?: string;
    peran?: string;
  };
}

/**
 * TODO: ganti dengan middleware auth asli dari branch feat/backend-auth-user.
 * Stub tipis yang membaca dan memvalidasi user id dari JWT Bearer token.
 */
export function requireAuthStub(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (req.user?.idPengguna) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Header Authorization Bearer diperlukan.' },
    });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Token JWT tidak boleh kosong.' },
    });
    return;
  }

  try {
    const segments = token.split('.');
    if (segments.length !== 3) {
      throw new Error('Format JWT tidak valid');
    }

    const secret = process.env.JWT_SECRET;
    if (secret) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${segments[0]}.${segments[1]}`)
        .digest('base64url');
      if (segments[2] !== expectedSignature) {
        throw new Error('Signature JWT tidak cocok');
      }
    }

    const decodedPayload = JSON.parse(
      Buffer.from(segments[1], 'base64url').toString('utf8')
    ) as {
      idPengguna?: string;
      id_pengguna?: string;
      userId?: string;
      sub?: string;
      peran?: string;
      role?: string;
      exp?: number;
    };

    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      throw new Error('Token JWT sudah kedaluwarsa');
    }

    const idPengguna =
      decodedPayload.idPengguna ??
      decodedPayload.id_pengguna ??
      decodedPayload.userId ??
      decodedPayload.sub;

    if (!idPengguna || typeof idPengguna !== 'string') {
      throw new Error('Payload JWT tidak memiliki klaim identitas pengguna');
    }

    req.user = {
      idPengguna,
      peran: decodedPayload.peran ?? decodedPayload.role,
    };
    next();
  } catch {
    res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Token JWT tidak valid atau telah kedaluwarsa.' },
    });
  }
}

export function createChatsRouter(controller?: KomunikasiController): Router {
  const router = Router();
  const komunikasiController = controller ?? new KomunikasiController();

  router.use(requireAuthStub);

  // /conversations didaftarkan sebelum /:idLawanBicara agar tidak tertangkap sebagai parameter
  router.get('/conversations', komunikasiController.getConversationsHandler);
  router.post('/', komunikasiController.sendChatHandler);
  router.get('/:idLawanBicara', komunikasiController.getChatHistoryHandler);
  router.patch('/:idLawanBicara/read', komunikasiController.markChatReadHandler);

  return router;
}

const chatsRouter = createChatsRouter();
export default chatsRouter;