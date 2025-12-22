import { useState } from 'react'
import { NovedadesInsertDto } from '@/types'
import { uploadImageToCloudinary } from '../services/uploadImageToCloudinary'

type Props = {
  onSubmit: (dto: NovedadesInsertDto) => Promise<any>
  creating: boolean
}

export default function FormCarrusel({ onSubmit, creating }: Props) {
  const [isUploading, setIsUploading] = useState(false)

  const [form, setForm] = useState<NovedadesInsertDto>({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    prioridad: false,
  })

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const url = await uploadImageToCloudinary(file)
      setForm({ ...form, imagenUrl: url })
    } finally {
      setIsUploading(false)
    }
  }

  const submit = async () => {
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Crear Novedad con Imagen</h2>

      <input
        className="border border-gray-300 dark:border-gray-600 p-2 w-full mb-2 rounded dark:bg-gray-700 dark:text-white"
        placeholder="Título"
        value={form.titulo}
        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
      />

      <input
        type="file"
        onChange={handleImageChange}
        className="mb-2"
        accept="image/*"
        disabled={isUploading}
      />

      {isUploading && (
        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2 block">
          Subiendo imagen...
        </span>
      )}

      {form.imagenUrl && !isUploading && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            Imagen cargada
          </span>
          <button
            type="button"
            onClick={() => setForm({ ...form, imagenUrl: '' })}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 hover:underline"
          >
            Quitar
          </button>
        </div>
      )}

      <textarea
        className="border border-gray-300 dark:border-gray-600 p-2 w-full mb-2 rounded dark:bg-gray-700 dark:text-white"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
      />

      <input
        type="date"
        className="border border-gray-300 dark:border-gray-600 p-2 w-full mb-2 rounded dark:bg-gray-700 dark:text-white"
        value={form.fechaExpiracion.toISOString().slice(0, 10)}
        onChange={(e) => setForm({ ...form, fechaExpiracion: new Date(e.target.value) })}
      />

      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={form.prioridad}
          onChange={(e) => setForm({ ...form, prioridad: e.target.checked })}
        />
        <span className="text-sm dark:text-gray-200">Prioritaria</span>
      </label>

      <button
        onClick={submit}
        disabled={creating || isUploading || !form.imagenUrl}
        className="w-full bg-[#ECB22E] hover:bg-[#d9a429] px-4 py-2 rounded text-white disabled:opacity-50 transition-colors"
      >
        {creating ? 'Creando...' : 'Agregar al Carrusel'}
      </button>
    </div>
  )
}
