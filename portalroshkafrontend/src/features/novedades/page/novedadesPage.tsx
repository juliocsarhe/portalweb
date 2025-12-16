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

  const [searchTerm, setSearchTerm] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [filteredCarrusel, setFilteredCarrusel] = useState<NovedadesResponseDto[]>([])
  const [filteredAvisos, setFilteredAvisos] = useState<NovedadesResponseDto[]>([])

  const [formCarrusel, setFormCarrusel] = useState<NovedadesInsertDto>({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde hoy
    prioridad: false,
  })

  const [formAviso, setFormAviso] = useState<NovedadesInsertDto>({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde hoy
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

    if (searchDate) {
      const targetDate = new Date(searchDate).toISOString().split('T')[0]
      filteredC = filteredC.filter((n) => {
        const createdDate = new Date(n.fechaCreacion).toISOString().split('T')[0]
        return createdDate === targetDate
      })
      filteredA = filteredA.filter((n) => {
        const createdDate = new Date(n.fechaCreacion).toISOString().split('T')[0]
        return createdDate === targetDate
      })
    }

    setFilteredCarrusel(filteredC)
    setFilteredAvisos(filteredA)
  }, [carrusel, avisos, searchTerm, searchDate])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      console.error('Tipo de archivo no válido:', file.type)
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error(`Imagen muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: 5MB`)
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

        console.log('Dimensiones: ' + width + 'x' + height + 'px')

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
          console.log('URL de Cloudinary:', url)
          console.log('Esta novedad irá al CARRUSEL')
          setFormCarrusel({ ...formCarrusel, imagenUrl: url })
        } catch (err) {
          console.error('Error al subir imagen:', err)
          e.target.value = ''
        } finally {
          setIsUploading(false)
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl)
        setIsUploading(false)
        console.error('Error al cargar la imagen')
        e.target.value = ''
      }

      img.src = imageUrl
    } catch (err) {
      console.error('Error al procesar la imagen:', err)
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const submitCarrusel = async () => {
    try {
      if (!formCarrusel.titulo.trim()) {
        alert('El título es obligatorio')
        return
      }

      if (!formCarrusel.imagenUrl.trim()) {
        alert('Debes subir una imagen para el carrusel')
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

      console.log('Enviando al backend:', JSON.stringify(dto, null, 2))

      const res = await create(dto)

      if (!res) {
        console.error('Error al crear la novedad del carrusel')
        alert('Error al crear la novedad del carrusel. Revisa los logs del backend.')
        return
      }

      console.log('Respuesta del backend:', res)

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

      alert('Novedad agregada al carrusel exitosamente')
      console.log('NOVEDAD CREADA y agregada al CARRUSEL')
    } catch (err: any) {
      console.error('Error completo:', err)
      console.error('Mensaje de error:', err?.message)
      console.error('Response:', err?.response)
      alert('Error al crear la novedad del carrusel. Revisa la consola y los logs del backend.')
    }
  }

  const submitAviso = async () => {
    try {
      if (!formAviso.titulo.trim()) {
        alert('El título es obligatorio')
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

      console.log('Enviando al backend:', dto)

      const res = await create(dto)

      if (!res) {
        alert('Error al crear el aviso')
        return
      }

      console.log('Respuesta del backend:', res)

      await refetch()

      setFormAviso({
        titulo: '',
        descripcion: '',
        imagenUrl: '',
        fechaExpiracion: new Date(Date.now() + 7 * 24 * 60 * 1000),
        prioridad: false,
      })

      alert('Aviso creado exitosamente')
      console.log('AVISO CREADO y agregado a la sección de AVISOS')
    } catch (err) {
      console.error('Error completo:', err)
      alert('Error al crear el aviso')
    }
  }

  const handleUpdate = async (payload: any) => {
    const res = await update(payload)
    if (res) {
      await refetch()
      setEditItem(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta novedad?')) return
    const res = await remove(id)
    if (res) await refetch()
  }

  const carruselSale = searchTerm || searchDate ? filteredCarrusel : carrusel
  const avisosHome = searchTerm || searchDate ? filteredAvisos : avisos

  return (
    <PageLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-brand-blue dark:text-white">
          Crear Novedades
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ECB22E] text-2xl">
                photo_library
              </span>
              <h2 className="text-xl font-semibold text-brand-blue dark:text-white">
                Crear Novedad con Imagen
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                submitCarrusel()
              }}
              className="space-y-4 flex-1 flex flex-col"
            >
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Título *
                </label>
                <input
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Título del carrusel"
                  value={formCarrusel.titulo}
                  onChange={(e) => setFormCarrusel({ ...formCarrusel, titulo: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Imagen *
                </label>
                <input
                  id="carrusel-image-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                  required
                />
                {isUploading && (
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1 block">
                    Subiendo imagen...
                  </span>
                )}
                {formCarrusel.imagenUrl && !isUploading && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
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
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 hover:underline"
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
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Descripción (opcional)
                </label>
                <textarea
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
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
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Fecha expiración
                  </label>
                  <input
                    type="date"
                    className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white text-sm"
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
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formCarrusel.prioridad}
                      onChange={(e) =>
                        setFormCarrusel({ ...formCarrusel, prioridad: e.target.checked })
                      }
                    />
                    <span className="text-sm dark:text-gray-200">Prioritaria</span>
                  </label>
                </div>
              </div>

              <div className="flex-1"></div>

              <button
                type="submit"
                disabled={creating || isUploading || !formCarrusel.imagenUrl}
                className="w-full bg-[#ECB22E] hover:bg-[#d9a429] px-6 py-2 rounded font-semibold text-white disabled:opacity-50 transition-colors"
              >
                {creating ? 'Creando...' : '+ Agregar al Carrusel'}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ECB22E] text-2xl">campaign</span>
              <h2 className="text-xl font-semibold text-brand-blue dark:text-white">Crear Aviso</h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                submitAviso()
              }}
              className="space-y-4 flex-1 flex flex-col"
            >
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Título *
                </label>
                <input
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Título del aviso"
                  value={formAviso.titulo}
                  onChange={(e) => setFormAviso({ ...formAviso, titulo: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Descripción (opcional)
                </label>
                <textarea
                  className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                  placeholder="Descripción del aviso"
                  rows={4}
                  value={formAviso.descripcion}
                  onChange={(e) => setFormAviso({ ...formAviso, descripcion: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Fecha expiración
                  </label>
                  <input
                    type="date"
                    className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white text-sm"
                    value={formAviso.fechaExpiracion.toISOString().slice(0, 10)}
                    onChange={(e) =>
                      setFormAviso({ ...formAviso, fechaExpiracion: new Date(e.target.value) })
                    }
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formAviso.prioridad}
                      onChange={(e) => setFormAviso({ ...formAviso, prioridad: e.target.checked })}
                    />
                    <span className="text-sm dark:text-gray-200">Prioritaria</span>
                  </label>
                </div>
              </div>

              <div className="flex-1"></div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-[#ECB22E] hover:bg-[#d9a429] px-6 py-2 rounded font-semibold text-white disabled:opacity-50 transition-colors"
              >
                {creating ? 'Creando...' : '+ Crear Aviso'}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-brand-blue dark:text-white">
            Gestionar Novedades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Buscar por título o descripción
              </label>
              <input
                type="text"
                placeholder="Escribe aquí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                Buscar por fecha de creación
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          {(searchTerm || searchDate) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSearchDate('')
              }}
              className="mt-3 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {carruselSale.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ECB22E] text-2xl">
                photo_library
              </span>
              <h2 className="text-xl font-semibold text-brand-blue dark:text-white">
                Carrusel con imagen
                {(searchTerm || searchDate) && ` - ${carruselSale.length} resultado(s)`}
              </h2>
            </div>
            <CarruselNovedades items={carruselSale} />
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-brand-blue dark:text-white">
                Gestionar Carrusel
              </h3>
              <AvisosList items={carruselSale} onEdit={setEditItem} onDelete={handleDelete} />
            </div>
          </div>
        )}

        {avisosHome.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#ECB22E] text-2xl">campaign</span>
              <h2 className="text-xl font-semibold text-brand-blue dark:text-white">
                Avisos sin imagen
                {(searchTerm || searchDate) && ` - ${avisosHome.length} resultado(s)`}
              </h2>
            </div>
            <AvisosList items={avisosHome} onEdit={setEditItem} onDelete={handleDelete} />
          </div>
        )}

        {(searchTerm || searchDate) && carruselSale.length === 0 && avisosHome.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron novedades con los filtros aplicados
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
    </PageLayout>
  )
}
