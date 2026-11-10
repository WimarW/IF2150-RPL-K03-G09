import { Prisma, Role } from '@prisma/client';
import prisma from '../database/prisma';
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
     * ALGO-019 / Q-013: cari CS dengan status = 'Available' ATAU jumlahTiketDipegang < 5.
     * Diurutkan ke beban terkecil; FOR UPDATE membuat tiket yang masuk bersamaan antre, sehingga beban CS terhitung benar.
     */
    public static async cariLayananKosong(tx: Prisma.TransactionClient): Promise<string | null> {
        const rows = await tx.$queryRaw<{ id_layanan_pelanggan: string }[]>`
            SELECT id_layanan_pelanggan FROM layanan_pelanggan
            WHERE status = 'Available' OR jumlah_tiket_dipegang < 5
            ORDER BY jumlah_tiket_dipegang ASC, id_layanan_pelanggan ASC
            LIMIT 1 FOR UPDATE`;
        return rows[0]?.id_layanan_pelanggan ?? null;
    }

    public static async tambahBeban(tx: Prisma.TransactionClient, idLayananPelanggan: string): Promise<void> {
        await tx.layananPelanggan.update({
            where: { idLayananPelanggan },
            data: { jumlahTiketDipegang: { increment: 1 } },
        });
    }

    public static async kurangiBeban(tx: Prisma.TransactionClient, idLayananPelanggan: string): Promise<void> {
        await tx.layananPelanggan.updateMany({
            where: { idLayananPelanggan, jumlahTiketDipegang: { gt: 0 } },
            data: { jumlahTiketDipegang: { decrement: 1 } },
        });
    }

    public static async exists(idLayananPelanggan: string): Promise<boolean> {
        return (await prisma.layananPelanggan.count({ where: { idLayananPelanggan } })) > 0;
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