import { useState } from 'react'
import { UsuarioEquipoProyectoItem } from '@/types/UsuarioEquipoProyecto.types'
import { useAuth } from '@/app/providers/AuthContext'

interface AsignarTareasModalProps {
  open: boolean
  data: UsuarioEquipoProyectoItem
  onClose: () => void
  onSuccess: () => void
}

export default function AsignarTareasModal({
  open,
  data,
  onClose,
  onSuccess,
}: AsignarTareasModalProps) {
  const { token } = useAuth()

  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async () => {
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria')
      return
    }

    if (!token) {
      setError('No autorizado')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/v1/teamleader/historial/descripcion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
                body: JSON.stringify({
                idUsuario: data.idUsuario,
                idEquipo: data.idEquipo,
                idProyecto: data.idProyecto,
                descripcion,
        }),
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}`)
      }

      onSuccess()
    } catch (err) {
      console.error(err)
          setError('Error al asignar la tarea')
    } finally {
      setLoading(false)
        }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl rounded-2xl p-6 bg-white dark:bg-slate-900 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900
                     dark:text-gray-300 dark:hover:text-white">
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">Asignar tarea</h2>
        <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <p>
            <strong>Usuario:</strong>{' '}
            {data.nombreCompleto ?? `${data.nombre} ${data.apellido}`}
          </p>
          <p>
            <strong>Equipo:</strong> {data.nombreEquipo}
          </p>
          <p>
            <strong>Proyecto:</strong> {data.nombreProyecto}
          </p>
        </div>

        <textarea
          className="w-full min-h-[120px] p-3 border rounded focus:outline-hidden focus:ring-2 focus:ring-blue-500 
          bg-white text-gray-900 border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          placeholder="Describa la tarea a asignar..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}/>

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white
                       hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Asignar'}
          </button>
        </div>
      </div>
    </div>
  )
}
