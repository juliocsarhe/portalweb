// src/features/novedades/pages/NovedadesPage.tsx
import { useState, useEffect } from 'react'
import PageLayout from '@/layouts/PageLayout'
import { NovedadesInsertDto, NovedadesResponseDto } from '@/types'
import { useGetNovedades } from '../hooks/useGetNovedades'
import { useCrearNovedades } from '../hooks/useCrearNovedades'
import CarruselNovedades from '../components/CarruselNovedades'
import AvisosList from '../components/AvisosList'

export default function NovedadesPage() {
  const { data, loading } = useGetNovedades()
  const { create, loading: creating } = useCrearNovedades()

  const [carrusel, setCarrusel] = useState<NovedadesResponseDto[]>([])
  const [avisos, setAvisos] = useState<NovedadesResponseDto[]>([])
  const [form, setForm] = useState<NovedadesInsertDto>({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: new Date(),
    prioridad: false,
  })

  // Convertir archivo a base64
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (err) => reject(err)
    })

  // Separar carrusel y avisos
  useEffect(() => {
    setCarrusel(data.filter((n) => n.imagenUrl && n.imagenUrl.trim() !== ''))
    setAvisos(data.filter((n) => !n.imagenUrl || n.imagenUrl.trim() === ''))
  }, [data])

  // Crear novedad
  const submitCreate = async () => {
    const res = await create(form)
    if (!res) return

    if (res.imagenUrl && res.imagenUrl.trim() !== '') setCarrusel((p) => [res, ...p])
    else setAvisos((p) => [res, ...p])

    setForm({
      titulo: '',
      descripcion: '',
      imagenUrl: '',
      fechaExpiracion: new Date(),
      prioridad: false,
    })
  }

  return (
    <PageLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-4">Crear Novedad</h1>

        <form
          className="bg-white p-4 rounded shadow mb-6"
          onSubmit={(e) => { e.preventDefault(); submitCreate() }}
        >
          <input
            className="border p-2 w-full mb-2 rounded"
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />

          <textarea
            className="border p-2 w-full mb-2 rounded"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            required
          />

          <div className="flex gap-2 items-center mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const base64 = await toBase64(file)
                  setForm({ ...form, imagenUrl: base64 })
                }
              }}
            />
            <span className="text-sm text-gray-500">o dejá vacío para avisos</span>
          </div>

          <label className="block text-sm mb-1">Fecha expiración</label>
          <input
            type="date"
            className="border p-2 w-full mb-2 rounded"
            value={form.fechaExpiracion.toISOString().slice(0, 10)}
            onChange={(e) => setForm({ ...form, fechaExpiracion: new Date(e.target.value) })}
          />

          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={form.prioridad}
              onChange={(e) => setForm({ ...form, prioridad: e.target.checked })}
            />
            Prioridad
          </label>

          <button className="bg-[#ECB22E] px-4 py-2 rounded font-semibold text-white">
            {creating ? 'Creando...' : 'Crear'}
          </button>
        </form>
        
        <h2 className="font-semibold text-lg mb-2 mt-6">Avisos</h2>
        <AvisosList items={avisos} />
      </div>
    </PageLayout>
  )
}
