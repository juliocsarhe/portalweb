import { useState } from 'react'
import { InsertDto, NovedadesDefaultResponseDto } from '@/types'
import { novedadesService } from '../services/novedadesService'

export const useCrearNovedades = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (dto: InsertDto): Promise<NovedadesDefaultResponseDto | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await novedadesService.create(dto)
      return res
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}
