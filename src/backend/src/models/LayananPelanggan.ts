import { Role } from '@prisma/client';
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

    public override toJSON(): Record<string, unknown> {
        return {
        ...super.toJSON(),
        idLayananPelanggan: this.idPengguna,
        status: this.status,
        jumlahTiketDipegang: this.jumlahTiketDipegang,
        };
    }
}

