import { useState } from 'react'
import { NovedadesUpdateDto, NovedadesDefaultResponseDto } from '@/types'
import { novedadesService } from '../services/novedadesService'

export const useUpdateNovedades = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (dto: NovedadesUpdateDto): Promise<NovedadesDefaultResponseDto | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await novedadesService.update(dto)
      return res
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { update, loading, error }
}
