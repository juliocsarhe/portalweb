import { useEffect, useState } from 'react'
import { useAuth } from '../../../app/providers/AuthContext'
import { getSolicitudesTL, PaginatedResponse } from '../services/RequestTLService'
import type { SolicitudItem } from '../../../types'

export function useRequestTL(page: number, subTipo?: string, size: number = 10) {
  const { token } = useAuth()

  const [allSolicitudes, setAllSolicitudes] = useState<SolicitudItem[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    getSolicitudesTL(token, page, size)
      .then((res: PaginatedResponse<SolicitudItem>) => {
        let content = res.content
        if (subTipo) {
          content = content.filter((s) => s.subTipo === subTipo)
        }
        setAllSolicitudes(content)
        setTotalPages(res.totalPages)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token, subTipo, page, size])

  return {
    solicitudes: allSolicitudes,
    totalPages,
    loading,
    error,
  }
}
