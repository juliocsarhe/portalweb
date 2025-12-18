import { useState } from 'react'
import { NovedadesDefaultResponseDto, NovedadesInsertDto } from '@/types'
import { novedadesService } from '../services/novedadesService'
import { useAuth } from '@/app/providers/AuthContext'

export function useCrearNovedades() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (
    dto: NovedadesInsertDto
  ): Promise<NovedadesDefaultResponseDto | null> => {
    if (!token) {
      setError('No hay token disponible')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      return await novedadesService.create(dto, token)
    } catch (err: any) {
      setError(err?.message || 'Error al crear novedad')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}