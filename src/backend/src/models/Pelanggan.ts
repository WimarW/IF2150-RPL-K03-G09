import { randomUUID } from 'crypto';
import { Role } from '@prisma/client';
import { prisma } from '../database/prisma';
import { Pengguna, PenggunaProps } from './Pengguna';

export interface CreatePelangganInput {
    namaPengguna: string;
    username: string;
    email: string;
    nomorTelepon: string;
    passwordHash: string;
    avatarUrl?: string | null;
}


export class Pelanggan extends Pengguna {
    constructor(props: PenggunaProps) {
        super({
        ...props,
        role: Role.PELANGGAN,
        akumulasiRating: props.akumulasiRating ?? 0.0,
        riwayatRating: props.riwayatRating ?? [],
        });
  }

    public static makePelanggan(input: CreatePelangganInput): Pelanggan {
        return new Pelanggan({
            idPengguna: randomUUID(),
            namaPengguna: input.namaPengguna.trim(),
            username: input.username.trim(),
            email: input.email.trim().toLowerCase(),
            nomorTelepon: input.nomorTelepon.trim(),
            passwordHash: input.passwordHash,
            role: Role.PELANGGAN,
            avatarUrl: input.avatarUrl ?? null,
            akumulasiRating: 0.0,
            riwayatRating: [],
            });
    }
    public toResponse() {
        return {
            idPengguna: this.idPengguna,
            namaPengguna: this.namaPengguna,
            username: this.username,
            email: this.email,
            nomorTelpon: this.nomorTelepon,
            nomorTelepon: this.nomorTelepon,
            role: this.role,
            avatarUrl: this.avatarUrl,
        };
    }
    public async simpanKeDb(): Promise<Pelanggan> {
    const saved = await prisma.pengguna.create({
      data: {
        idPengguna: this.idPengguna,
        namaPengguna: this.namaPengguna,
        username: this.username,
        email: this.email,
        nomorTelpon: this.nomorTelepon,
        password: this.passwordHash,
        role: Role.PELANGGAN,
        avatarUrl: this.avatarUrl,
        akumulasiRating: 0.0,
        riwayatRating: [],
      },
    });

    return new Pelanggan({
      idPengguna: saved.idPengguna,
      namaPengguna: saved.namaPengguna,
      username: saved.username,
      email: saved.email,
      nomorTelepon: saved.nomorTelpon,
      passwordHash: saved.password,
      role: saved.role,
      avatarUrl: saved.avatarUrl,
      akumulasiRating: saved.akumulasiRating,
      riwayatRating: saved.riwayatRating,
    });
  }

}