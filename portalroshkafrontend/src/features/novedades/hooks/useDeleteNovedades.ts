<<<<<<< HEAD
// src/features/novedades/hooks/useDeleteNovedades.ts
import { useState } from 'react'
import { novedadesService } from '../services/novedadesService'
import { useAuth } from '@/app/providers/AuthContext'
import { NovedadesDefaultResponseDto } from '@/types'

export function useDeleteNovedades() {
  const { token } = useAuth()
=======
import { useState } from 'react'
import { NovedadesDefaultResponseDto } from '@/types'
import { novedadesService } from '../services/novedadesService'
export const useDeleteNovedades = () => {
>>>>>>> feature/novedades-innovation
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async (id: number): Promise<NovedadesDefaultResponseDto | null> => {
<<<<<<< HEAD
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
=======
    setLoading(true)
    setError(null)
    try {
      const res = await novedadesService.delete(id)
      return res
    } catch (err: any) {
      setError(err.message)
>>>>>>> feature/novedades-innovation
      return null
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}
