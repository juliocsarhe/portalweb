import { useCallback, useEffect, useMemo, useState } from 'react'
import { UsuarioEquipoProyectoItem } from '@/types/UsuarioEquipoProyecto.types'

export function useAsignarTareas(token: string | null) {
  const [data, setData] = useState<UsuarioEquipoProyectoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [idEquipo, setIdEquipo] = useState<number | undefined>()
  const [idProyecto, setIdProyecto] = useState<number | undefined>()

  const fetchData = useCallback(async () => {
    if (!token) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/v1/teamleader/equipos/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}`)
      }

      const json: UsuarioEquipoProyectoItem[] = await res.json()
      setData(json) 
    } catch (err) {
      setError('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchData()
    }
  }, [token, fetchData])

  const equipos = useMemo(() => {
    const map = new Map<number, string>()
    data.forEach((d) => map.set(d.idEquipo, d.nombreEquipo))
    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }))
  }, [data])

  const proyectos = useMemo(() => {
    const map = new Map<number, string>()
    data.forEach((d) => map.set(d.idProyecto, d.nombreProyecto))
    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }))
  }, [data])

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const text = `${row.nombre} ${row.apellido} ${row.nombreEquipo} ${row.nombreProyecto}`.toLowerCase()

      const matchSearch = search
        ? text.includes(search.toLowerCase())
        : true

      const matchEquipo = idEquipo ? row.idEquipo === idEquipo : true
      const matchProyecto = idProyecto ? row.idProyecto === idProyecto : true

      return matchSearch && matchEquipo && matchProyecto
    })
  }, [data, search, idEquipo, idProyecto])

  return {
    data: filteredData,
    loading,
    error,
    search,
    setSearch,
    idEquipo,
    setIdEquipo,
    idProyecto,
    setIdProyecto,
    equipos,
    proyectos,
    refresh: fetchData,
  }
}
