import { NovedadesResponseDto } from '@/types';

const API_URL_PUBLIC = 'http://localhost:8080/api/v1/usuarios/novedades';

export const novedadesServicePublic = {
  async getAll(): Promise<NovedadesResponseDto[]> {
    const res = await fetch(API_URL_PUBLIC);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getCarrusel(): Promise<NovedadesResponseDto[]> {
    const res = await fetch(`${API_URL_PUBLIC}/carrusel`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  async getAvisos(): Promise<NovedadesResponseDto[]> {
    const res = await fetch(`${API_URL_PUBLIC}/avisos`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
