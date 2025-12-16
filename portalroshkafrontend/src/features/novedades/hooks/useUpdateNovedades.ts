<<<<<<< HEAD
// src/features/novedades/hooks/useUpdateNovedades.ts
import { useState } from 'react'
import { NovedadesUpdateDto, NovedadesDefaultResponseDto } from '@/types'
import { novedadesService } from '../services/novedadesService'
import { useAuth } from '@/app/providers/AuthContext'

export function useUpdateNovedades() {
  const { token } = useAuth()
=======
import { useState } from 'react'
import { NovedadesUpdateDto, NovedadesDefaultResponseDto } from '@/types'
import { novedadesService } from '../services/novedadesService'
import { useAuth } from '@/app/providers/AuthContext'

export const useUpdateNovedades = () => {
>>>>>>> feature/novedades-innovation
export function useUpdateNovedades() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (
    dto: NovedadesUpdateDto
  ): Promise<NovedadesDefaultResponseDto | null> => {
    if (!token) {
      setError('No hay token disponible')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      return await novedadesService.update(dto, token)
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar novedad')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}
