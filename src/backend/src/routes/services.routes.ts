import { Router } from 'express';
import { KategoriJasaController } from '../controllers/KategoriJasaController';
import { PemberiJasaController } from '../controllers/PemberiJasaController';

const router = Router();

const pemberiJasaController = new PemberiJasaController();
const kategoriJasaController = new KategoriJasaController(undefined, pemberiJasaController);

/**
 * Endpoint Katalog Kategori Jasa (C13 & C15)
 * - GET  /api/services/categories      -> Daftar seluruh kategori terurut alfabetis (Q-015)
 * - GET  /api/services/categories/:id  -> Detail kategori berdasarkan ID
 * - POST /api/services/categories      -> Simpan kategori baru & kaitkan ke pemberi jasa (Q-014 & Q-004)
 * - POST /api/services/register        -> Pendaftaran layanan penyedia jasa & ubah role akun menjadi PEMBERI_JASA (UC01, KF04, KF05)
 */
router.get('/categories', kategoriJasaController.getAllCategoriesHandler);
router.get('/categories/:id', kategoriJasaController.getCategoryByIdHandler);
router.post('/categories', kategoriJasaController.createCategoryAndBindServiceHandler);
router.post('/register', kategoriJasaController.registerServiceProviderHandler);


router.get('/search', pemberiJasaController.searchServicesHandler);


router.get('/category/:kategoriId', pemberiJasaController.getServicesByCategoryHandler);


router.get('/:id', pemberiJasaController.getServiceByIdHandler);

export default router;