import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  PenggunaController,
  RegistrationInputPayload,
  ValidationResult,
} from './PenggunaController';
import { Pengguna } from '../models/Pengguna';
import { PemberiJasa, PemberiJasaDetail } from '../models/PemberiJasa';
import { calculateHaversineDistance } from '../utils/haversine';

export interface ProviderRegistrationPayload extends RegistrationInputPayload {
  idKategoriJasa?: string;
  jenisJasa?: string;
  namaToko?: string;
  latitude?: number;
  longitude?: number;
}

export type SortOption =
  | 'nearest'
  | 'terdekat'
  | 'rating'
  | 'rating_terbaik'
  | 'cheapest'
  | 'termurah';

export interface SearchQueryParams {
  keyword?: string;
  idKategoriJasa?: string;
  lat?: number;
  long?: number;
  radiusKm?: number;
  sortBy?: SortOption;
}

/**
 * Kelas C06 - PemberiJasaController
 * Mengatur registrasi pemberi jasa (static) serta logika pemberi jasa
 * dan pencarian layanan (UC01, UC02) (instance).
 * Mengatur logika program untuk registrasi pemberi jasa, manajemen profil, dan pencarian layanan (UC01, UC02)
 */
export class PemberiJasaController extends PenggunaController {
  private pemberiJasa: PemberiJasa;

  constructor(pemberiJasaModel?: PemberiJasa) {
    super();
    this.pemberiJasa = pemberiJasaModel ?? new PemberiJasa();
  }

  public static override validasiInfoRegistrasi(
    payload: ProviderRegistrationPayload
  ): ValidationResult & {
    providerData?: {
      idKategoriJasa: string;
      jenisJasa: string;
      namaToko?: string;
      latitude?: number | null;
      longitude?: number | null;
    };
  } {
    const baseValidation = super.validasiInfoRegistrasi(payload);
    if (!baseValidation.valid) {
      return baseValidation;
    }

    const idKategoriJasa = (payload.idKategoriJasa ?? '').trim();
    const jenisJasa = (payload.jenisJasa ?? '').trim();
    const namaToko = payload.namaToko ? payload.namaToko.trim() : undefined;

    if (!idKategoriJasa) {
      return {
        valid: false,
        message: 'Field idKategoriJasa wajib diisi untuk Pemberi Jasa.',
      };
    }

    if (!jenisJasa) {
      return {
        valid: false,
        message: 'Field jenisJasa wajib diisi untuk Pemberi Jasa.',
      };
    }

    return {
      ...baseValidation,
      providerData: {
        idKategoriJasa,
        jenisJasa,
        namaToko,
        latitude: typeof payload.latitude === 'number' ? payload.latitude : null,
        longitude: typeof payload.longitude === 'number' ? payload.longitude : null,
      },
    };
  }

  public static async registrasiPemberiJasa(req: Request, res: Response): Promise<void> {
    try {
      const validation = PemberiJasaController.validasiInfoRegistrasi(req.body);
      if (!validation.valid || !validation.sanitizedData || !validation.providerData) {
        res.status(400).json({
          success: false,
          message: validation.message,
        });
        return;
      }

      const { namaPengguna, username, password, email, nomorTelepon, avatarUrl } =
        validation.sanitizedData;
      const { idKategoriJasa, jenisJasa, namaToko, latitude, longitude } =
        validation.providerData;

      // Cek duplikasi username atau email di database (Q-005)
      const { usernameExists, emailExists } = await Pengguna.cekDuplikasiKredensial(
        username,
        email
      );

      if (usernameExists || emailExists) {
        res.status(400).json({
          success: false,
          message: usernameExists
            ? 'Username sudah terdaftar. Silakan gunakan username lain.'
            : 'Email sudah terdaftar. Silakan gunakan alamat email lain.',
        });
        return;
      }

      const passwordHash = await bcrypt.hash(
        password,
        PemberiJasaController.BCRYPT_SALT_ROUNDS
      );

      const pemberiJasaBaru = PemberiJasa.makePemberiJasa({
        namaPengguna,
        username,
        email,
        nomorTelepon,
        passwordHash,
        avatarUrl,
        idKategoriJasa,
        jenisJasa,
        namaToko,
        latitude,
        longitude,
      });

      const savedPemberiJasa = await pemberiJasaBaru.simpanKeDb();

      res.status(201).json({
        success: true,
        message: 'Registrasi pemberi jasa berhasil.',
        data: savedPemberiJasa.toJSON(),
      });
    } catch (error) {
      console.error('[PemberiJasaController.registrasiPemberiJasa] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan internal saat memproses registrasi pemberi jasa.',
      });
    }
  }


  /**
   * ALGO-007: Memvalidasi keberadaan dan keabsahan ID pemberi jasa
   */
  public validatePemberiJasa(idPemberiJasa: string): boolean {
    if (!idPemberiJasa || typeof idPemberiJasa !== 'string' || idPemberiJasa.trim() === '') {
      return false;
    }
    return true;
  }

  /**
   * ALGO-008: Mengatur informasi ID kategori jasa pada objek pemberi jasa
   * dan menyimpannya ke database (ALGO-004 / Q-004)
   */
  public async setInformasiKategoriJasa(
    idKategoriJasa: string,
    idPemberiJasa?: string,
    extraData?: { namaToko?: string; latitude?: number; longitude?: number }
  ): Promise<PemberiJasaDetail | null> {
    this.pemberiJasa.setIDKategoriJasa(idKategoriJasa);
    if (idPemberiJasa) {
      this.pemberiJasa.setIDPemberiJasa(idPemberiJasa);
    }

    if (this.pemberiJasa.getIDPemberiJasa()) {
      return await this.pemberiJasa.savePemberiJasa(
        this.pemberiJasa.getIDPemberiJasa(),
        idKategoriJasa,
        extraData
      );
    }

    return null;
  }

  /**
   * ALGO-009: Mengambil data detail pemberi jasa berdasarkan ID
   */
  public async fetchPemberiJasaById(idPemberiJasa: string): Promise<PemberiJasaDetail | null> {
    if (!this.validatePemberiJasa(idPemberiJasa)) {
      return null;
    }
    return await this.pemberiJasa.getPemberiJasaByID(idPemberiJasa.trim());
  }

  /**
   * ALGO-010: Mengambil dan menampilkan daftar pemberi jasa berdasarkan kategori jasa tertentu
   */
  public async showPemberiJasaFromKategori(idKategoriJasa: string): Promise<PemberiJasaDetail[]> {
    if (!idKategoriJasa || idKategoriJasa.trim() === '') {
      return [];
    }
    return await this.pemberiJasa.getPemberiJasaByKategori(idKategoriJasa.trim());
  }

  /**
   * ALGO-011: Memilih pemberi jasa tertentu dan mengembalikan detail profilnya
   */
  public async choosePemberiJasa(idPemberiJasa: string): Promise<PemberiJasaDetail | null> {
    if (!this.validatePemberiJasa(idPemberiJasa)) {
      return null;
    }
    return await this.pemberiJasa.getPemberiJasaByID(idPemberiJasa.trim());
  }

  /**
   * Pencarian penyedia jasa dengan filter teks, kategori, kalkulasi jarak GPS (Haversine),
   * serta pengurutan berdasarkan Terdekat, Rating Terbaik, atau Termurah (KNF05)
   */
  public async searchServices(params: SearchQueryParams): Promise<PemberiJasaDetail[]> {
    const { keyword, idKategoriJasa, lat, long, radiusKm, sortBy } = params;

    const results = await this.pemberiJasa.searchPemberiJasa({
      keyword,
      idKategoriJasa,
    });

    const hasValidUserCoords =
      typeof lat === 'number' &&
      !Number.isNaN(lat) &&
      typeof long === 'number' &&
      !Number.isNaN(long);

    // Hitung jarak Haversine apabila koordinat user diberikan
    let processed: PemberiJasaDetail[] = results.map((item) => {
      if (
        hasValidUserCoords &&
        item.latitude !== null &&
        item.latitude !== undefined &&
        item.longitude !== null &&
        item.longitude !== undefined
      ) {
        const jarakKm = calculateHaversineDistance(lat!, long!, item.latitude, item.longitude);
        return { ...item, jarakKm };
      }
      return { ...item, jarakKm: null };
    });

    // Filter radius (opsional jika parameter radiusKm disertakan)
    if (
      hasValidUserCoords &&
      typeof radiusKm === 'number' &&
      !Number.isNaN(radiusKm) &&
      radiusKm > 0
    ) {
      processed = processed.filter(
        (item) => item.jarakKm !== null && item.jarakKm !== undefined && item.jarakKm <= radiusKm
      );
    }

    // Tentukan metode pengurutan (default ke 'nearest' jika ada koordinat, atau 'rating' jika tidak)
    const effectiveSort: SortOption = sortBy ?? (hasValidUserCoords ? 'nearest' : 'rating');

    processed.sort((a, b) => {
      if (effectiveSort === 'nearest' || effectiveSort === 'terdekat') {
        const distA = a.jarakKm ?? Number.POSITIVE_INFINITY;
        const distB = b.jarakKm ?? Number.POSITIVE_INFINITY;
        if (distA !== distB) return distA - distB;
        return b.akumulasiRating - a.akumulasiRating;
      }

      if (effectiveSort === 'cheapest' || effectiveSort === 'termurah') {
        const tarifA = a.tarif ?? Number.POSITIVE_INFINITY;
        const tarifB = b.tarif ?? Number.POSITIVE_INFINITY;
        if (tarifA !== tarifB) return tarifA - tarifB;
        return b.akumulasiRating - a.akumulasiRating;
      }

      // Default: 'rating' / 'rating_terbaik' (akumulasi_rating DESC)
      if (b.akumulasiRating !== a.akumulasiRating) {
        return b.akumulasiRating - a.akumulasiRating;
      }
      const distA = a.jarakKm ?? Number.POSITIVE_INFINITY;
      const distB = b.jarakKm ?? Number.POSITIVE_INFINITY;
      return distA - distB;
    });

    return processed;
  }

  /**
   * Express Handler: GET /api/services/search
   */
  public searchServicesHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const keyword = (req.query.q as string) || (req.query.keyword as string) || undefined;
      const idKategoriJasa =
        (req.query.kategoriId as string) ||
        (req.query.idKategoriJasa as string) ||
        (req.query.categoryId as string) ||
        undefined;

      const rawLat = req.query.lat !== undefined ? Number(req.query.lat) : undefined;
      const rawLong =
        req.query.long !== undefined
          ? Number(req.query.long)
          : req.query.lng !== undefined
          ? Number(req.query.lng)
          : undefined;
      const rawRadius = req.query.radiusKm !== undefined ? Number(req.query.radiusKm) : undefined;
      const sortBy = (req.query.sortBy as SortOption) || (req.query.sort as SortOption) || undefined;

      const data = await this.searchServices({
        keyword,
        idKategoriJasa,
        lat: rawLat,
        long: rawLong,
        radiusKm: rawRadius,
        sortBy,
      });

      res.status(200).json({
        success: true,
        count: data.length,
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Gagal melakukan pencarian layanan jasa',
      });
    }
  };

  /**
   * Express Handler: GET /api/services/:id
   */
  public getServiceByIdHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!this.validatePemberiJasa(id)) {
        res.status(400).json({
          success: false,
          message: 'ID Pemberi Jasa tidak valid',
        });
        return;
      }

      const detail = await this.fetchPemberiJasaById(id);
      if (!detail) {
        res.status(404).json({
          success: false,
          message: 'Pemberi jasa tidak ditemukan',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: detail,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil detail pemberi jasa',
      });
    }
  };

  /**
   * Express Handler: GET /api/services/category/:kategoriId
   */
  public getServicesByCategoryHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { kategoriId } = req.params;
      const list = await this.showPemberiJasaFromKategori(kategoriId);

      res.status(200).json({
        success: true,
        count: list.length,
        data: list,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Gagal mengambil daftar pemberi jasa berdasarkan kategori',
      });
    }
  };
}

export default PemberiJasaController;