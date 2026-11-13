import { Prisma, Role } from '@prisma/client';
import { Pengguna, PenggunaProps } from './Pengguna';

export interface LayananPelangganProps extends PenggunaProps {
    status?: string;
    jumlahTiketDipegang?: number;
}

export class LayananPelanggan extends Pengguna {
    private status: string;
    private jumlahTiketDipegang: number;

    constructor(props: LayananPelangganProps) {
        super({
        ...props,
        role: Role.LAYANAN_PELANGGAN,
        });
        this.status = props.status ?? 'Available';
        this.jumlahTiketDipegang = props.jumlahTiketDipegang ?? 0;
    }

    public getStatus(): string {
        return this.status;
    }

    public getJumlahTiketDipegang(): number {
        return this.jumlahTiketDipegang;
    }

    /**
     * ALGO-019 / Q-013: cari CS dengan status = 'Available' DAN jumlahTiketDipegang < 5.
     * Diurutkan ke beban terkecil. FOR UPDATE membuat tiket yang masuk bersamaan antre,
     * sehingga beban CS terhitung benar.
     */
    public static async cariLayananKosong(tx: Prisma.TransactionClient): Promise<string | null> {
        const rows = await tx.$queryRaw<{ id_layanan_pelanggan: string }[]>`
            SELECT id_layanan_pelanggan FROM layanan_pelanggan
            WHERE status = 'Available' AND jumlah_tiket_dipegang < 5
            ORDER BY jumlah_tiket_dipegang ASC, id_layanan_pelanggan ASC
            FOR UPDATE SKIP LOCKED
            LIMIT 1`;
        return rows[0]?.id_layanan_pelanggan ?? null;
    }

    public static async tambahBeban(tx: Prisma.TransactionClient, idLayananPelanggan: string): Promise<void> {
        const updated = await tx.layananPelanggan.update({
            where: { idLayananPelanggan },
            data: { jumlahTiketDipegang: { increment: 1 } },
        });
        if (updated.jumlahTiketDipegang >= 5 && updated.status === 'Available') {
            await tx.layananPelanggan.update({
                where: { idLayananPelanggan },
                data: { status: 'Busy' },
            });
        }
    }

    public static async kurangiBeban(tx: Prisma.TransactionClient, idLayananPelanggan: string): Promise<void> {
        await tx.$executeRaw`
            UPDATE layanan_pelanggan
            SET jumlah_tiket_dipegang = GREATEST(jumlah_tiket_dipegang - 1, 0),
                status = CASE
                    WHEN GREATEST(jumlah_tiket_dipegang - 1, 0) < 5 AND status = 'Busy' THEN 'Available'
                    ELSE status
                END
            WHERE id_layanan_pelanggan = ${idLayananPelanggan}`;
    }

    public override toJSON(): Record<string, unknown> {
        return {
        ...super.toJSON(),
        idLayananPelanggan: this.idPengguna,
        status: this.status,
        jumlahTiketDipegang: this.jumlahTiketDipegang,
        };
    }
}

