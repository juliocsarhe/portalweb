// src/features/novedades/hooks/useGetNovedades.ts
import { useEffect, useState } from 'react'
import { NovedadesResponseDto } from '@/types'
import { novedadesService } from '../services/novedadesService'
import { useAuth } from '@/app/providers/AuthContext'

export function useGetNovedades() {
  const { token } = useAuth()
  const [data, setData] = useState<NovedadesResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setError('No hay token disponible')
      setLoading(false)
      return
    }

    novedadesService
      .getAll(token)
      .then(setData)
      .catch((err) => setError(err?.message || 'Error al obtener novedades'))
      .finally(() => setLoading(false))
  }, [token])

  return { data, loading, error }
}
