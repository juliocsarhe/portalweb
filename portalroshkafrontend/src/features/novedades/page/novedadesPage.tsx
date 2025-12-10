// src/features/novedades/pages/NovedadesPage.tsx
import { useState, useEffect } from 'react'
import { NovedadesInsertDto, NovedadesResponseDto } from '@/types'
import { useGetNovedades } from '../hooks/useGetNovedades'
import { useCrearNovedades } from '../hooks/useCrearNovedades'
import PageLayout from '@/layouts/PageLayout'

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

  useEffect(() => {
    setCarrusel(data.filter((n) => n.imagenUrl))
    setAvisos(data.filter((n) => !n.imagenUrl))
  }, [data])

  const submit = async () => {
    const res = await create(form)
    if (!res) return

    if (res.imagenUrl) setCarrusel((p) => [...p, res])
    else setAvisos((p) => [...p, res])

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
        <h1 className="text-2xl font-bold mb-4">Novedades</h1>

        {/* FORM */}
        <form
          className="bg-white p-4 rounded shadow mb-6"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <input
            className="border p-2 w-full mb-2"
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            required
          />

          <textarea
            className="border p-2 w-full mb-2"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            required
          />

          <input
            className="border p-2 w-full mb-2"
            placeholder="URL Imagen (opcional)"
            value={form.imagenUrl}
            onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
          />

          <input
            type="date"
            className="border p-2 w-full mb-2"
            value={form.fechaExpiracion.toISOString().slice(0, 10)}
            onChange={(e) =>
              setForm({ ...form, fechaExpiracion: new Date(e.target.value) })
            }
          />

          <select
            className="border p-2 w-full mb-2"
            value={form.prioridad ? 'true' : 'false'}
            onChange={(e) =>
              setForm({ ...form, prioridad: e.target.value === 'true' })
            }
          >
            <option value="false">Prioridad: No</option>
            <option value="true">Prioridad: Sí</option>
          </select>

          <button className="bg-[#ECB22E] px-4 py-2 rounded font-semibold">
            {creating ? 'Creando...' : 'Crear'}
          </button>
        </form>

        {/* LISTAS */}
        <h2 className="font-semibold text-lg mb-1">Carrusel</h2>
        <ul className="space-y-2 mb-6">
          {carrusel.map((n) => (
            <li key={n.idNovedades} className="bg-white p-4 rounded shadow">
              <h3>{n.titulo}</h3>
              <p>{n.descripcion}</p>
              {n.imagenUrl && (
                <img
                  src={n.imagenUrl}
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              )}
            </li>
          ))}
        </ul>

        <h2 className="font-semibold text-lg mb-1">Avisos</h2>
        <ul className="space-y-2">
          {avisos.map((n) => (
            <li key={n.idNovedades} className="bg-white p-4 rounded shadow">
              <h3>{n.titulo}</h3>
              <p>{n.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </PageLayout>
  )
}

