import { useState } from 'react'
import { NovedadesDefaultResponseDto } from '@/types'
import { novedadesService } from '../services/novedadesService'
export const useDeleteNovedades = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async (id: number): Promise<NovedadesDefaultResponseDto | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await novedadesService.delete(id)
      return res
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { remove, loading, error }
}
