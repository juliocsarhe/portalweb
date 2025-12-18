import { useState, useEffect } from 'react';
import { NovedadesResponseDto } from '@/types';
import { novedadesServicePublic } from '../services/novedadesServicePublic';

export function useGetCarruselPublic() {
  const [data, setData] = useState<NovedadesResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    novedadesServicePublic
      .getCarrusel()
      .then(setData)
      .catch((err) => setError(err?.message || 'Error al obtener carrusel'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useGetAvisosPublic() {
  const [data, setData] = useState<NovedadesResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    novedadesServicePublic
      .getAvisos()
      .then(setData)
      .catch((err) => setError(err?.message || 'Error al obtener avisos'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
