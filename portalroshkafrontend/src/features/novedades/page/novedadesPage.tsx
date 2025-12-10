// src/features/novedades/pages/NovedadesPage.tsx
import React, { useState, useEffect } from 'react'
import PageLayout from '@/layouts/PageLayout'
import { NovedadesInsertDto, NovedadesResponseDto, NovedadesUpdateDto } from '@/types'
import { useGetNovedades } from '../hooks/useGetNovedades'
import { useCrearNovedades } from '../hooks/useCrearNovedades'
import { useUpdateNovedades } from '../hooks/useUpdateNovedades'
import { useDeleteNovedades } from '../hooks/useDeleteNovedades'
import UploadImageButton from '../../../shared/ui/components/UploadImageButton'

// -------------------------
// Helpers
// -------------------------
const toDisplayDate = (dateStr: string) => {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-ES') // dd/mm/yyyy
}

const fromDisplayToISO = (displayDate: string) => {
  const [dia, mes, anio] = displayDate.split('/')
  if (!dia || !mes || !anio) return null
  return `${anio}-${mes}-${dia}`
}

export default function NovedadesPage() {
  const { data, loading, error } = useGetNovedades()
  const { create, loading: creating, error: createError } = useCrearNovedades()
  const { update, loading: updating, error: updateError } = useUpdateNovedades()
  const { remove, loading: deleting, error: deleteError } = useDeleteNovedades()

  const [carrusel, setCarrusel] = useState<NovedadesResponseDto[]>([])
  const [avisos, setAvisos] = useState<NovedadesResponseDto[]>([])

  // FILTRO FECHA EN FORMATO dd/mm/yyyy
  const [filterDate, setFilterDate] = useState<string>('')

  const [form, setForm] = useState<NovedadesInsertDto>({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: new Date(),
    prioridad: false,
  })

  const [editId, setEditId] = useState<number | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  // -------------------------
  // EFECTO PARA CARGAR Y FILTRAR
  // -------------------------
  useEffect(() => {
    if (!data) return

    // IDs eliminados guardados localmente
    const deletedIds: number[] = JSON.parse(localStorage.getItem("deletedNovedades") || "[]")

    // Ocultar los eliminados
    let visible = data.filter((n) => !deletedIds.includes(n.idNovedades))

    // Filtro de fecha dd/mm/yyyy -> ISO
    if (filterDate) {
      const iso = fromDisplayToISO(filterDate)
      if (iso) {
        visible = visible.filter((n) => n.fechaExpiracion.slice(0, 10) === iso)
      }
    }

    setCarrusel(visible.filter((n) => n.imagenUrl))
    setAvisos(visible.filter((n) => !n.imagenUrl))
  }, [data, filterDate])

  // -------------------------
  // SUBMIT CREAR / EDITAR
  // -------------------------
  const submit = async () => {
    try {
      if (editId !== null) {
        const dto: NovedadesUpdateDto = {
          id: editId,
          titulo: form.titulo,
          descripcion: form.descripcion,
          imagenUrl: form.imagenUrl,
          fechaExpiracion: form.fechaExpiracion.toISOString(),
          prioridad: form.prioridad,
        }

        const res = await update(dto)
        if (!res) return

        setCarrusel((p) =>
          [...p.filter((n) => n.idNovedades !== res.idNovedades), res]
            .sort((a, b) => (b.prioridad ? 1 : -1))
        )
        setAvisos((p) => [...p.filter((n) => n.idNovedades !== res.idNovedades), res])

        setEditId(null)
      } else {
        const res = await create(form)
        if (!res) return

        if (res.imagenUrl) setCarrusel((p) => [...p, res])
        else setAvisos((p) => [...p, res])
      }

      setForm({
        titulo: '',
        descripcion: '',
        imagenUrl: '',
        fechaExpiracion: new Date(),
        prioridad: false,
      })

      setImageError(null)
    } catch (err) {
      console.error(err)
    }
  }

  // -------------------------
  // EDITAR
  // -------------------------
  const startEdit = (n: NovedadesResponseDto) => {
    setForm({
      titulo: n.titulo,
      descripcion: n.descripcion,
      imagenUrl: n.imagenUrl,
      fechaExpiracion: new Date(n.fechaExpiracion),
      prioridad: n.prioridad,
    })
    setEditId(n.idNovedades)
  }

  // -------------------------
  // ELIMINAR + LOCALSTORAGE
  // -------------------------
  const handleDelete = async (id: number) => {
    const res = await remove(id)
    if (!res) return

    // Guardar preferencia del usuario
    const deleted = JSON.parse(localStorage.getItem("deletedNovedades") || "[]")

    if (!deleted.includes(id)) {
      deleted.push(id)
      localStorage.setItem("deletedNovedades", JSON.stringify(deleted))
    }

    // Remover de UI
    setCarrusel((p) => p.filter((n) => n.idNovedades !== id))
    setAvisos((p) => p.filter((n) => n.idNovedades !== id))
  }

  // -------------------------
  // SUBIDA DE IMAGEN
  // -------------------------
const handleImageSelect = async (file: File) => {
  try {
    setImageUploading(true)
    setImageError(null)

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (err) => reject(err)
    })
    const cleanBase64 = base64.split(',')[1]

    setForm({ ...form, imagenUrl: cleanBase64 })
  } catch (err) {
    setImageError('Error al subir la imagen')
    console.error(err)
  } finally {
    setImageUploading(false)
  }
}

  // -------------------------
  // UI
  // -------------------------
  return (
    <PageLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-4">Novedades</h1>

        {/* FORM */}
        <form
          className="bg-gray-800 p-4 rounded shadow mb-6 text-white"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <input
            className="border p-2 w-full mb-2 bg-gray-900 text-white"
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />

          <textarea
            className="border p-2 w-full mb-2 bg-gray-900 text-white"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            required
          />

          <div className="flex items-center gap-2 mb-2">
            <UploadImageButton onImageSelect={handleImageSelect} isUploading={imageUploading} />
            {imageError && <span className="text-red-500">{imageError}</span>}
          </div>

          {/* FECHA */}
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            className="border p-2 w-full mb-2 bg-gray-900 text-white"
            value={form.fechaExpiracion.toLocaleDateString('es-ES')}
            onChange={(e) => {
              const parts = e.target.value.split('/')
              if (parts.length === 3) {
                const [d, m, y] = parts
                const newDate = new Date(`${y}-${m}-${d}`)
                if (!isNaN(newDate.getTime())) {
                  setForm({ ...form, fechaExpiracion: newDate })
                }
              }
            }}
          />

          {/* PRIORIDAD */}
          <select
            className="border p-2 w-full mb-2 bg-gray-900 text-white"
            value={form.prioridad ? 'true' : 'false'}
            onChange={(e) => setForm({ ...form, prioridad: e.target.value === 'true' })}
          >
            <option value="false">Prioridad: No</option>
            <option value="true">Prioridad: Sí</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded font-semibold"
            style={{ backgroundColor: '#ECB22E', color: '#1A1F37' }}
          >
            {creating || updating ? 'Procesando...' : editId ? 'Actualizar' : 'Crear'}
          </button>
        </form>

        {/* FILTRO */}
        <div className="mb-4">
          <label>Filtrar por fecha:</label>
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-2 ml-2 bg-gray-900 text-white"
          />
        </div>

        {(loading || creating || updating || deleting) && <p>Cargando...</p>}
        {(error || createError || updateError || deleteError) && (
          <p className="text-red-500 mb-2">
            {error || createError || updateError || deleteError}
          </p>
        )}

        {/* CARRUSEL */}
        <h2 className="font-semibold text-lg mb-1">Carrusel</h2>
        <ul className="space-y-2 mb-6">
          {carrusel.map((n) => (
            <li
              key={n.idNovedades}
              className="bg-gray-900 p-4 rounded shadow flex justify-between items-start text-white"
            >
              <div>
                <h3>{n.titulo}</h3>
                <p>{n.descripcion}</p>
                <p className="text-sm text-gray-400">
                  Expira: {toDisplayDate(n.fechaExpiracion)}
                </p>
                {n.imagenUrl && (
                  <img src={n.imagenUrl} className="w-32 h-32 object-cover mt-2 rounded" />
                )}
              </div>

              <div className="space-y-2">
                <button
                  className="px-2 py-1 rounded font-semibold"
                  style={{ backgroundColor: '#1A1F37', color: '#ECB22E' }}
                  onClick={() => startEdit(n)}
                >
                  Editar
                </button>

                <button
                  className="px-2 py-1 rounded font-semibold"
                  style={{ backgroundColor: '#1A1F37', color: '#ECB22E' }}
                  onClick={() => handleDelete(n.idNovedades)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* AVISOS */}
        <h2 className="font-semibold text-lg mb-1">Avisos</h2>
        <ul className="space-y-2">
          {avisos.map((n) => (
            <li
              key={n.idNovedades}
              className="bg-gray-900 p-4 rounded shadow flex justify-between items-start text-white"
            >
              <div>
                <h3>{n.titulo}</h3>
                <p>{n.descripcion}</p>
                <p className="text-sm text-gray-400">
                  Expira: {toDisplayDate(n.fechaExpiracion)}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  className="px-2 py-1 rounded font-semibold"
                  style={{ backgroundColor: '#1A1F37', color: '#ECB22E' }}
                  onClick={() => startEdit(n)}
                >
                  Editar
                </button>
                <button
                  className="px-2 py-1 rounded font-semibold"
                  style={{ backgroundColor: '#1A1F37', color: '#ECB22E' }}
                  onClick={() => handleDelete(n.idNovedades)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </PageLayout>
  )
}
