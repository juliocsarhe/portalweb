// src/features/novedades/hooks/useDeleteNovedades.ts
import { useState } from 'react'
import { novedadesService } from '../services/novedadesService'
import { useAuth } from '@/app/providers/AuthContext'
import { NovedadesDefaultResponseDto } from '@/types'

export function useDeleteNovedades() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async (
    id: number
  ): Promise<NovedadesDefaultResponseDto | null> => {
    if (!token) {
      setError('No hay token disponible')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      return await novedadesService.delete(id, token)
    } catch (err: any) {
      setError(err?.message || 'Error al eliminar novedad')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}
