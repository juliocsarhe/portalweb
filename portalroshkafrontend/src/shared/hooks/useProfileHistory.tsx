import { ProfileHistoryItem } from "@/types/profileHistory.types";
import { useEffect, useState } from "react";
import { mapHistorialToProfileHistory } from "../mappers/profileHistory.mapper";


export function useProfileHistory(
  token?: string,
  usuarioId?: number
) {
  const [data, setData] = useState<ProfileHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const url = usuarioId
      ? `http://localhost:8080/api/v1/admin/th/usuarios/${usuarioId}/historial`
      : `http://localhost:8080/api/v1/profile/historial`

    const fetchHistory = async () => {
      try {
        setLoading(true)

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Error al cargar el historial')
        }

        const json = await res.json()
        setData(mapHistorialToProfileHistory(json))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [token, usuarioId])

  return { data, loading, error }
}
