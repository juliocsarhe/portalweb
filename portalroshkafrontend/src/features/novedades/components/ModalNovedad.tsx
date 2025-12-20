import { useState, useEffect } from 'react'
import { NovedadesResponseDto, NovedadesUpdateDto } from '@/types'

type Props = {
  open: boolean
  onClose: () => void
  item: NovedadesResponseDto | null
  onSave: (payload: NovedadesUpdateDto) => Promise<void> | void
}

export default function ModalNovedad({ open, onClose, item, onSave }: Props) {
  const [form, setForm] = useState<NovedadesUpdateDto | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!item) {
      setForm(null)
      return
    }
    setForm({
      id: item.idNovedades,
      titulo: item.titulo,
      descripcion: item.descripcion,
      imagenUrl: item.imagenUrl || '',
      fechaExpiracion: item.fechaExpiracion ? new Date(item.fechaExpiracion).toISOString() : new Date().toISOString(),
      prioridad: item.prioridad,
    })
  }, [item])

  if (!open || !form) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg p-6">
        <h3 className="text-xl text-black dark:text-white font-bold mb-3">Editar Novedad</h3>

        <input
          className="border p-2 w-full mb-2 rounded text-black dark:text-white"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
        />

        <textarea
          className="text-black dark:text-white border p-2 w-full mb-2 rounded"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        />

        <label className="text-black dark:text-white block text-sm mb-1">Fecha expiración</label>
        <input
          type="date"
          className="border p-2 w-full mb-2 rounded text-black dark:text-white"
          value={form.fechaExpiracion.slice(0, 10)}
          onChange={(e) => setForm({ ...form, fechaExpiracion: new Date(e.target.value).toISOString() })}
        />

        <label className="inline-flex items-center gap-2 mb-4 text-black dark:text-white">
          <input
            type="checkbox"
            checked={form.prioridad}
            onChange={(e) => setForm({ ...form, prioridad: e.target.checked })}
          />
          Prioridad
        </label>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-300"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 rounded bg-yellow-500 text-white"
            onClick={async () => {
              setSaving(true)
              try {
                await onSave(form)
              } finally {
                setSaving(false)
              }
            }}
            type="button"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
