import { useState } from 'react'
import { NovedadesInsertDto } from '@/types'

type Props = {
  onSubmit: (dto: NovedadesInsertDto) => Promise<any>
  creating: boolean
}

export default function FormAviso({ onSubmit, creating }: Props) {
  const [form, setForm] = useState<NovedadesInsertDto>({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    prioridad: false,
  })

  const submit = async () => {
    if (!form.titulo.trim()) {
      alert('El título es obligatorio')
      return
    }

    await onSubmit({
      ...form,
      fechaExpiracion: form.fechaExpiracion.toISOString().split('T')[0] as any,
    })

    setForm({
      titulo: '',
      descripcion: '',
      imagenUrl: '',
      fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      prioridad: false,
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[#ECB22E] text-2xl">
          campaign
        </span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Crear Aviso
        </h2>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Título *
          </label>
          <input
            className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#ECB22E] focus:border-transparent transition-all"
            placeholder="Título del aviso"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Descripción (opcional)
          </label>
          <textarea
            className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#ECB22E] focus:border-transparent transition-all"
            placeholder="Descripción del aviso"
            rows={4}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Fecha expiración
            </label>
            <input
              type="date"
              className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-[#ECB22E] focus:border-transparent transition-all"
              value={form.fechaExpiracion.toISOString().slice(0, 10)}
              onChange={(e) => setForm({ ...form, fechaExpiracion: new Date(e.target.value) })}
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.prioridad}
                onChange={(e) => setForm({ ...form, prioridad: e.target.checked })}
                className="w-4 h-4 text-[#ECB22E] rounded focus:ring-[#ECB22E]"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Prioritaria
              </span>
            </label>
          </div>
        </div>

        <div className="flex-1"></div>

        <button
          type="button"
          onClick={submit}
          disabled={creating}
          className="w-full bg-[#ECB22E] hover:bg-[#d9a429] px-6 py-2.5 rounded font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
        >
          {creating ? 'Creando...' : '+ Crear Aviso'}
        </button>
      </div>
    </div>
  )
}