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

export const useUpdateNovedades = () => {
>>>>>>> feature/novedades-innovation
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (dto: NovedadesUpdateDto): Promise<NovedadesDefaultResponseDto | null> => {
<<<<<<< HEAD
    if (!token) {
      setError('No token disponible')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      return await novedadesService.update(dto, token)
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar novedad')
=======
    setLoading(true)
    setError(null)
    try {
      const res = await novedadesService.update(dto)
      return res
    } catch (err: any) {
      setError(err.message)
>>>>>>> feature/novedades-innovation
      return null
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}
