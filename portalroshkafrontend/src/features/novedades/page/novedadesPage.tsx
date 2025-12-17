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
  
  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [filteredCarrusel, setFilteredCarrusel] = useState<NovedadesResponseDto[]>([])
  const [filteredAvisos, setFilteredAvisos] = useState<NovedadesResponseDto[]>([])

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

  // Filtrar por búsqueda
  useEffect(() => {
    let filteredC = carrusel
    let filteredA = avisos

    // Filtrar por título
    if (searchTerm) {
      filteredC = filteredC.filter(n => 
        n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
      filteredA = filteredA.filter(n => 
        n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por fecha
    if (searchDate) {
      const targetDate = new Date(searchDate).toISOString().split('T')[0]
      filteredC = filteredC.filter(n => {
        const createdDate = new Date(n.fechaCreacion).toISOString().split('T')[0]
        return createdDate === targetDate
      })
      filteredA = filteredA.filter(n => {
        const createdDate = new Date(n.fechaCreacion).toISOString().split('T')[0]
        return createdDate === targetDate
      })
    }

    setFilteredCarrusel(filteredC)
    setFilteredAvisos(filteredA)
  }, [carrusel, avisos, searchTerm, searchDate])

  // Subir imagen a Cloudinary con validación
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      console.error('Tipo de archivo no válido:', file.type)
      e.target.value = ''
      return
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error(`Imagen muy grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: 5MB`)
      e.target.value = ''
      return
    }

    try {
      setIsUploading(true)

      // Validar dimensiones
      const img = new Image()
      const imageUrl = URL.createObjectURL(file)
      
      img.onload = async () => {
        URL.revokeObjectURL(imageUrl)
        
        const width = img.width
        const height = img.height

        console.log(`📐 Dimensiones: ${width}x${height}px`)

        // Advertir si es muy pequeña
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
          console.log('✅ URL de Cloudinary:', url)
          console.log('🎯 Esta novedad irá al CARRUSEL')
          setForm({ ...form, imagenUrl: url })
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

  // Crear novedad
  const submitCreate = async () => {
    try {
      // Validaciones
      if (!form.titulo.trim()) {
        console.error('El título es obligatorio')
        return
      }

      if (!form.descripcion.trim()) {
        console.error('La descripción es obligatoria')
        return
      }

      // Determinar si tiene imagen válida
      const tieneImagen = form.imagenUrl && form.imagenUrl.trim() !== ''

      // Preparar el DTO - SI NO TIENE IMAGEN, ENVIAR STRING VACÍO
      const dto: NovedadesInsertDto = {
        ...form,
        imagenUrl: tieneImagen ? form.imagenUrl.trim() : '', // ← ESTO ES CLAVE
        fechaExpiracion: form.fechaExpiracion,
      }

      console.log('📤 Enviando al backend:', dto)
      console.log(`🎯 Destino: ${tieneImagen ? '🖼️ CARRUSEL (con imagen)' : '📋 AVISOS (sin imagen)'}`)

      // Confirmar si es aviso sin imagen
      if (!tieneImagen) {
        const confirmSinImagen = window.confirm(
          'CREAR AVISO (sin imagen)\n\n' +
          'Esta novedad NO aparecerá en el carrusel.\n' +
          'Solo se mostrará en la sección de AVISOS.\n\n' +
          '¿Continuar?'
        )
        if (!confirmSinImagen) return
      }

      const res = await create(dto)
      
      if (!res) {
        console.error('Error al crear la novedad')
        return
      }

      console.log('✅ Respuesta del backend:', res)

      // Refrescar lista
      await refetch()

      // Resetear formulario
      setForm({
        titulo: '',
        descripcion: '',
        imagenUrl: '',
        fechaExpiracion: new Date(),
        prioridad: false,
      })

      // Mensaje diferenciado
      if (tieneImagen) {
        console.log('✅ NOVEDAD CREADA y agregada al CARRUSEL')
      } else {
        console.log('✅ AVISO CREADO y agregado a la sección de AVISOS')
      }
    } catch (err) {
      console.error('Error completo:', err)
    }
  }

  // Actualizar
  const handleUpdate = async (payload: any) => {
    const res = await update(payload)
    if (res) {
      await refetch()
      setEditItem(null)
    }
  }

  // Eliminar
  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta novedad?')) return
    const res = await remove(id)
    if (res) await refetch()
  }

  return (
    <PageLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-brand-blue dark:text-white">
          Administrar Novedades
        </h1>

        {/* Formulario */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-brand-blue dark:text-white">
            Crear Nueva Novedad
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); submitCreate() }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Título *</label>
              <input
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                placeholder="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">Descripción *</label>
              <textarea
                className="border border-gray-300 dark:border-gray-600 p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                placeholder="Descripción"
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
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="border border-gray-300 dark:border-gray-600 p-2 rounded dark:bg-gray-700 dark:text-white"
                />
                {isUploading && (
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Subiendo imagen...
                  </span>
                )}
                {form.imagenUrl && !isUploading && (
                  <>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ✓ Imagen cargada → Irá al CARRUSEL
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, imagenUrl: '' })
                        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
                        if (fileInput) fileInput.value = ''
                      }}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 hover:underline"
                    >
                      ✕ Quitar
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {form.imagenUrl 
                  ? '🖼️ Esta novedad aparecerá en el CARRUSEL (con imagen)' 
                  : '📋 Sin imagen, esta novedad aparecerá solo en AVISOS'}
                <br />
                Dimensiones recomendadas: mínimo 800x600px | Máximo: 5MB
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">Fecha expiración</label>
                <input
                  type="date"
                  className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
                  value={form.fechaExpiracion.toISOString().slice(0, 10)}
                  onChange={(e) => setForm({ ...form, fechaExpiracion: new Date(e.target.value) })}
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.prioridad}
                    onChange={(e) => setForm({ ...form, prioridad: e.target.checked })}
                  />
                  <span className="text-sm">Prioritaria</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={creating || isUploading}
              className="bg-[#ECB22E] hover:bg-[#d9a429] px-6 py-2 rounded font-semibold text-white disabled:opacity-50"
            >
              {creating ? 'Creando...' : 'Crear Novedad'}
            </button>
          </form>
        </div>

        {/* Buscador */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-brand-blue dark:text-white">
            Buscar Novedades
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
              className="mt-3 text-sm text-red-600 hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Carrusel preview */}
        {filteredCarrusel.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Carrusel (con imagen) 
              {(searchTerm || searchDate) && ` - ${filteredCarrusel.length} resultado(s)`}
            </h2>
            <CarruselNovedades items={filteredCarrusel} />
            <div className="mt-4">
              <AvisosList items={filteredCarrusel} onEdit={setEditItem} onDelete={handleDelete} />
            </div>
          </div>
        )}

        {/* Avisos preview */}
        {filteredAvisos.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Avisos (sin imagen)
              {(searchTerm || searchDate) && ` - ${filteredAvisos.length} resultado(s)`}
            </h2>
            <AvisosList items={filteredAvisos} onEdit={setEditItem} onDelete={handleDelete} />
          </div>
        )}

        {/* Mensaje si no hay resultados */}
        {(searchTerm || searchDate) && filteredCarrusel.length === 0 && filteredAvisos.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No se encontraron novedades con los filtros aplicados
            </p>
          </div>
        )}

        <ModalNovedad open={!!editItem} onClose={() => setEditItem(null)} item={editItem} onSave={handleUpdate} />
      </div>
    </PageLayout>
  )
}