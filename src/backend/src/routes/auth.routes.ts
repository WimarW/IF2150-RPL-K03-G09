import { Router } from 'express';
import { PenggunaController } from '../controllers/PenggunaController';
import { PelangganController } from '../controllers/PelangganController';
import { PemberiJasaController } from '../controllers/PemberiJasaController';
import { LayananPelangganCtrl } from '../controllers/LayananPelangganCtrl';

const authRouter = Router();


authRouter.post('/register/pelanggan', PelangganController.registrasiPelanggan);
authRouter.post('/register/pemberi-jasa',PemberiJasaController.registrasiPemberiJasa);
authRouter.post('/login', PenggunaController.login);
authRouter.post('/login/cs', LayananPelangganCtrl.loginLayananPelanggan);

export default authRouter;
