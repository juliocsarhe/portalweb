import { useState, useEffect } from 'react'
import PageLayout from '@/layouts/PageLayout'
import { NovedadesInsertDto, NovedadesResponseDto } from '@/types'
import { useGetNovedades } from '../hooks/useGetNovedades'
import { useCrearNovedades } from '../hooks/useCrearNovedades'
import { useUpdateNovedades } from '../hooks/useUpdateNovedades'
import { useDeleteNovedades } from '../hooks/useDeleteNovedades'
import NovedadesTable from '../components/NovedadesTable'
import ModalNovedad from '../components/ModalNovedad'
import Toast from '@/shared/ui/components/Toast'
import { uploadImageToCloudinary } from '../services/uploadImageToCloudinary'
import AvisosList from '../components/AvisosList'

export default function NovedadesPage() {
  const { data, refetch } = useGetNovedades()
  const { create, loading: creating } = useCrearNovedades()
  const { update } = useUpdateNovedades()
  const { remove } = useDeleteNovedades()

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('info')

  const [carrusel, setCarrusel] = useState<NovedadesResponseDto[]>([])
  const [avisos, setAvisos] = useState<NovedadesResponseDto[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [editItem, setEditItem] = useState<NovedadesResponseDto | null>(null)

  const [prioridad, setPrioridad] = useState<NovedadesInsertDto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCarrusel, setFilteredCarrusel] = useState<NovedadesResponseDto[]>([])
  const [filteredAvisos, setFilteredAvisos] = useState<NovedadesResponseDto[]>([])

  const [formCarrusel, setFormCarrusel] = useState<NovedadesInsertDto>({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    prioridad: false,
  })

  const [formAviso, setFormAviso] = useState<NovedadesInsertDto>({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    prioridad: false,
  })

  useEffect(() => {
    setCarrusel(data.filter((n) => n.imagenUrl && n.imagenUrl.trim() !== ''))
    setAvisos(data.filter((n) => !n.imagenUrl || n.imagenUrl.trim() === ''))
  }, [data])

  useEffect(() => {
    let filteredC = carrusel
    let filteredA = avisos

    if (searchTerm) {
      filteredC = filteredC.filter(
        (n) =>
          n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
      filteredA = filteredA.filter(
        (n) =>
          n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCarrusel(filteredC)
    setFilteredAvisos(filteredA)
  }, [carrusel, avisos, searchTerm])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setToastMessage('Tipo de archivo no válido')
      setToastType('error')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setToastMessage(`Imagen muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: 5MB`)
      setToastType('error')
      e.target.value = ''
      return
    }

    try {
      setIsUploading(true)

      const img = new Image()
      const imageUrl = URL.createObjectURL(file)

      img.onload = async () => {
        URL.revokeObjectURL(imageUrl)

        const width = img.width
        const height = img.height

        if (width < 800 || height < 600) {
          const proceed = window.confirm(
            `ADVERTENCIA: Imagen de baja resolución\n\n` +
              `Dimensiones: ${width}x${height}px\n` +
              `Recomendado: 800x600px mínimo\n\n` +
              `La imagen se verá pixelada en el carrusel.\n\n` +
              `¿Continuar de todos modos?`
          )
          if (!proceed) {
            setIsUploading(false)
            e.target.value = ''
            return
          }
        }

        try {
          const url = await uploadImageToCloudinary(file)
          setFormCarrusel({ ...formCarrusel, imagenUrl: url })
        } catch (err) {
          setToastMessage('Error al subir imagen')
          setToastType('error')
          e.target.value = ''
        } finally {
          setIsUploading(false)
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl)
        setIsUploading(false)
        setToastMessage('Error al cargar la imagen')
        setToastType('error')
        e.target.value = ''
      }

      img.src = imageUrl
    } catch (err) {
      setToastMessage('Error al procesar la imagen')
      setToastType('error')
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const submitCarrusel = async () => {
    try {
      if (!formCarrusel.titulo.trim()) {
        setToastMessage('El título es obligatorio')
        setToastType('warning')
        return
      }

      if (!formCarrusel.imagenUrl.trim()) {
        setToastMessage('Debes subir una imagen para el carrusel')
        setToastType('warning')
        return
      }

      const fechaLocal = formCarrusel.fechaExpiracion.toISOString().split('T')[0]

      const dto: NovedadesInsertDto = {
        titulo: formCarrusel.titulo.trim(),
        descripcion: formCarrusel.descripcion.trim() || 'Sin descripción',
        imagenUrl: formCarrusel.imagenUrl.trim(),
        fechaExpiracion: fechaLocal as any,
        prioridad: formCarrusel.prioridad,
      }

      const res = await create(dto)

      if (!res) {
        setToastMessage('Error al crear la novedad.')
        setToastType('error')
        return
      }

      await refetch()

      setFormCarrusel({
        titulo: '',
        descripcion: '',
        imagenUrl: '',
        fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        prioridad: false,
      })

      const fileInput = document.querySelector('#carrusel-image-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      setToastMessage('Novedad creada exitosamente')
      setToastType('success')
    } catch (err) {
      setToastMessage('Error al crear la novedad.')
      setToastType('error')
    }
  }

  const submitAviso = async () => {
    try {
      if (!formAviso.titulo.trim()) {
        setToastMessage('El título es obligatorio')
        setToastType('warning')
        return
      }

      const fechaLocal = formAviso.fechaExpiracion.toISOString().split('T')[0]

      const dto: NovedadesInsertDto = {
        titulo: formAviso.titulo.trim(),
        descripcion: formAviso.descripcion.trim() || 'Sin descripción',
        imagenUrl: '',
        fechaExpiracion: fechaLocal as any,
        prioridad: formAviso.prioridad,
      }

      const res = await create(dto)

      if (!res) {
        setToastMessage('Error al crear el aviso')
        setToastType('error')
        return
      }

      await refetch()

      setFormAviso({
        titulo: '',
        descripcion: '',
        imagenUrl: '',
        fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 1000),
        prioridad: false,
      })

      setToastMessage(res?.message ?? 'Aviso creado exitosamente')
      setToastType('success')
    } catch (err) {
      setToastMessage('Error al crear el aviso')
      setToastType('error')
    }
  }

  const handleUpdate = async (payload: any) => {
    const res = await update(payload)
    if (res) {
      await refetch()
      setEditItem(null)
      setToastMessage('Novedad actualizada exitosamente')
      setToastType('success')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta novedad?')) return
    const res = await remove(id)
    if (res) {
      await refetch()
      setToastMessage('Novedad eliminada exitosamente')
      setToastType('success')
    }
  }
    const sortAvisos = (avisosList: NovedadesResponseDto[]) => {
    return [...avisosList].sort((a, b) => {
      const prioridadA = !!a.prioridad
      const prioridadB = !!b.prioridad

      if (prioridadA && !prioridadB) return -1
      if (!prioridadA && prioridadB) return 1

    const fechaA = new Date(a.fechaExpiracion + 'T00:00:00').getTime()
    const fechaB = new Date(b.fechaExpiracion + 'T00:00:00').getTime()

      return fechaA - fechaB
    })
  }

  useEffect(() => {
    console.log('Data recibida:', data)
    setCarrusel(data.filter((n) => n.imagenUrl && n.imagenUrl.trim() !== ''))
    setAvisos(data.filter((n) => !n.imagenUrl || n.imagenUrl.trim() === ''))
  }, [data])

  const carruselSale = searchTerm ? filteredCarrusel : carrusel
  const avisosHome = sortAvisos(searchTerm ? filteredAvisos : avisos)
  const allNovedades = searchTerm ? [...filteredCarrusel, ...filteredAvisos] : data

  return (
    <PageLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Crear Novedades</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ECB22E] text-2xl">
                photo_library
              </span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Crear Novedad con Imagen
              </h2>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Título *
                </label>
                <input
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#ECB22E] focus:border-transparent transition-all"
                  placeholder="Título del carrusel"
                  value={formCarrusel.titulo}
                  onChange={(e) => setFormCarrusel({ ...formCarrusel, titulo: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Imagen *
                </label>
                <input
                  id="carrusel-image-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#ECB22E] file:text-white file:font-medium hover:file:bg-[#d9a429] transition-all"
                />
                {isUploading && (
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-2 block flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Subiendo imagen...
                  </span>
                )}
                {formCarrusel.imagenUrl && !isUploading && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Imagen cargada
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFormCarrusel({ ...formCarrusel, imagenUrl: '' })
                        const fileInput = document.querySelector(
                          '#carrusel-image-input'
                        ) as HTMLInputElement
                        if (fileInput) fileInput.value = ''
                      }}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 hover:underline font-medium"
                    >
                      Quitar
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Dimensiones recomendadas: mínimo 800x600px | Máximo: 5MB
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Descripción (opcional)
                </label>
                <textarea
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#ECB22E] focus:border-transparent transition-all"
                  placeholder="Descripción breve..."
                  maxLength={250}
                  rows={2}
                  value={formCarrusel.descripcion}
                  onChange={(e) =>
                    setFormCarrusel({ ...formCarrusel, descripcion: e.target.value })
                  }
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
                    value={formCarrusel.fechaExpiracion.toISOString().slice(0, 10)}
                    onChange={(e) =>
                      setFormCarrusel({
                        ...formCarrusel,
                        fechaExpiracion: new Date(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formCarrusel.prioridad}
                      onChange={(e) =>
                        setFormCarrusel({ ...formCarrusel, prioridad: e.target.checked })
                      }
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
                onClick={submitCarrusel}
                disabled={creating || isUploading || !formCarrusel.imagenUrl}
                className="w-full bg-[#ECB22E] hover:bg-[#d9a429] px-6 py-2.5 rounded font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                {creating ? 'Creando...' : '+ Agregar al Carrusel'}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ECB22E] text-2xl">campaign</span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Crear Aviso</h2>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                  Título *
                </label>
                <input
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-[#ECB22E] focus:border-transparent transition-all"
                  placeholder="Título del aviso"
                  value={formAviso.titulo}
                  onChange={(e) => setFormAviso({ ...formAviso, titulo: e.target.value })}
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
                  value={formAviso.descripcion}
                  onChange={(e) => setFormAviso({ ...formAviso, descripcion: e.target.value })}
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
                    value={formAviso.fechaExpiracion.toISOString().slice(0, 10)}
                    onChange={(e) =>
                      setFormAviso({ ...formAviso, fechaExpiracion: new Date(e.target.value) })
                    }
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formAviso.prioridad}
                      onChange={(e) => setFormAviso({ ...formAviso, prioridad: e.target.checked })}
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
                onClick={submitAviso}
                disabled={creating}
                className="w-full bg-[#ECB22E] hover:bg-[#d9a429] px-6 py-2.5 rounded font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                {creating ? 'Creando...' : '+ Crear Aviso'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Gestionar Novedades
          </h2>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mb-4 text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              Limpiar búsqueda
            </button>
          )}

          <div className="overflow-x-auto max-h-96">
            <NovedadesTable items={allNovedades} onEdit={setEditItem} onDelete={handleDelete} />
          </div>
        </div>

        {searchTerm && carruselSale.length === 0 && avisosHome.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron novedades con la búsqueda aplicada
            </p>
          </div>
        )}

        <ModalNovedad
          open={!!editItem}
          onClose={() => setEditItem(null)}
          item={editItem}
          onSave={handleUpdate}
        />
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
    </PageLayout>
  )
}
