// src/features/novedades/pages/NovedadesPage.tsx
import { useState, useEffect } from 'react'
import PageLayout from '@/layouts/PageLayout'
import { NovedadesInsertDto, NovedadesResponseDto } from '@/types'
import { useGetNovedades } from '../hooks/useGetNovedades'
import { useCrearNovedades } from '../hooks/useCrearNovedades'
import { useUpdateNovedades } from '../hooks/useUpdateNovedades'
import { useDeleteNovedades } from '../hooks/useDeleteNovedades'
import CarruselNovedades from '../components/CarruselNovedades'
import AvisosList from '../components/AvisosList'
import ModalNovedad from '../components/ModalNovedad'
import { uploadImageToCloudinary } from '../services/uploadImageToCloudinary'

export default function NovedadesPage() {
  const { data, refetch } = useGetNovedades()
  const { create, loading: creating } = useCrearNovedades()
  const { update } = useUpdateNovedades()
  const { remove } = useDeleteNovedades()

  const [carrusel, setCarrusel] = useState<NovedadesResponseDto[]>([])
  const [avisos, setAvisos] = useState<NovedadesResponseDto[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [editItem, setEditItem] = useState<NovedadesResponseDto | null>(null)

  const [form, setForm] = useState<NovedadesInsertDto>({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: new Date(),
    prioridad: false,
  })

  // Separar carrusel y avisos
  useEffect(() => {
    setCarrusel(data.filter((n) => n.imagenUrl && n.imagenUrl.trim() !== ''))
    setAvisos(data.filter((n) => !n.imagenUrl || n.imagenUrl.trim() === ''))
  }, [data])

  // Subir imagen a Cloudinary
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const url = await uploadImageToCloudinary(file)
      console.log('URL de Cloudinary:', url)
      setForm({ ...form, imagenUrl: url })
    } catch (err) {
      console.error('Error al subir imagen:', err)
      alert('Error al subir la imagen. Intente nuevamente.')
    } finally {
      setIsUploading(false)
    }
  }

  // Crear novedad
  const submitCreate = async () => {
    try {
      const res = await create(form)
      if (!res) {
        alert('Error al crear la novedad')
        return
      }
      await refetch()
      setForm({
        titulo: '',
        descripcion: '',
        imagenUrl: '',
        fechaExpiracion: new Date(),
        prioridad: false,
      })

      alert('Novedad creada exitosamente')
    } catch (err) {
      console.error('Error:', err)
      alert('Error al crear la novedad')
    }
  }

  // Actualizar novedad
  const handleUpdate = async (payload: any) => {
    const res = await update(payload)
    if (res) {
      await refetch()
      setEditItem(null)
    }
  }

  // Eliminar novedad
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta novedad?')) return

    const res = await remove(id)
    if (res) {
      await refetch()
    }
  }

  return (
    <PageLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-brand-blue dark:text-white">
          Administrar Novedades
        </h1>

        {/* Formulario de creación */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-brand-blue dark:text-white">
            Crear Nueva Novedad
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              submitCreate()
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Título *</label>
              <input
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                placeholder="Título de la novedad"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Descripción *
              </label>
              <textarea
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                placeholder="Descripción detallada"
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Imagen (opcional - para carrusel)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="border border-gray-300 dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white"
                />
                {isUploading && (
                  <span className="text-sm text-blue-600 dark:text-blue-400">Subiendo...</span>
                )}
                {form.imagenUrl && !isUploading && (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    ✓ Imagen cargada
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Si no subes imagen, la novedad aparecerá solo en avisos
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Fecha de expiración
                </label>
                <input
                  type="date"
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                  value={form.fechaExpiracion.toISOString().slice(0, 10)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fechaExpiracion: new Date(e.target.value),
                    })
                  }
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.prioridad}
                    onChange={(e) => setForm({ ...form, prioridad: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium dark:text-gray-200">
                    Marcar como prioritaria
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={creating || isUploading}
              className="bg-[#ECB22E] hover:bg-[#d9a429] px-6 py-2 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creando...' : 'Crear Novedad'}
            </button>
          </form>
        </div>

        {/* Carrusel */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-brand-blue dark:text-white">
            Carrusel (con imagen)
          </h2>
          {carrusel.length > 0 ? (
            <>
              <CarruselNovedades items={carrusel} />
              <div className="mt-4">
                <AvisosList items={carrusel} onEdit={setEditItem} onDelete={handleDelete} />
              </div>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No hay novedades con imagen</p>
          )}
        </div>

        {/* Avisos */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-brand-blue dark:text-white">
            Avisos (sin imagen)
          </h2>
          <AvisosList items={avisos} onEdit={setEditItem} onDelete={handleDelete} />
        </div>

        {/* Modal de edición */}
        <ModalNovedad
          open={!!editItem}
          onClose={() => setEditItem(null)}
          item={editItem}
          onSave={handleUpdate}
        />
      </div>
    </PageLayout>
  )
}
