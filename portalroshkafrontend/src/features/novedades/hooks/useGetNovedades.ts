import { useEffect, useState } from 'react'
import { NovedadesResponseDto } from '@/types'
import { novedadesService } from '../services/novedadesService'
import { useAuth } from '@/app/providers/AuthContext'

export function useGetNovedades() {
  const { token } = useAuth()
  const [data, setData] = useState<NovedadesResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!token) {
      setError('No hay token disponible')
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await novedadesService.getAll(token)
      setData(res)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al obtener novedades'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  return { data, loading, error, refetch: fetchData }
}
