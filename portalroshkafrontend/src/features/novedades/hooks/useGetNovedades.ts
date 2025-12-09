import { useEffect, useState } from 'react'
import { NovedadesResponseDto } from '@/types'
import { novedadesService } from '../services/novedadesService'

export const useGetNovedades = () => {
  const [data, setData] = useState<NovedadesResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    novedadesService
      .getAll()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])
  return { data, loading, error }
}
