import { useEffect, useState } from 'react'
import { InsertDto, NovedadesResponseDto, NovedadesDefaultResponseDto } from '@/types'
import PageLayout from '@/layouts/PageLayout'

export default function NovedadesPage() {
  const [novedades, setNovedades] = useState<NovedadesResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<InsertDto>({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    fechaExpiracion: new Date(),
    categoria: '',
    prioridad: '',
  })

  // Traer todas las novedades
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:8080/api/v1/admin/th')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar novedades')
        return res.json()
      })
      .then((data: NovedadesResponseDto[]) => setNovedades(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Crear novedad
  const crearNovedad = () => {
    setLoading(true)
    fetch('http://localhost:8080/api/v1/admin/th/novedades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al crear novedad')
        return res.json()
      })
      .then((newNovedad: NovedadesDefaultResponseDto) => {
        setNovedades(prev => [
          ...prev,
          { ...form, idNovedades: newNovedad.id, activo: true } as NovedadesResponseDto,
        ])
        // Reset form
        setForm({
          titulo: '',
          descripcion: '',
          imagenUrl: '',
          fechaExpiracion: new Date(),
          categoria: '',
          prioridad: '',
        })
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  return (
    <PageLayout>
    <div className="p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <h1 className="text-2xl font-bold text-black dark:text-gray-200 mb-6">Novedades</h1>

      {/* Formulario */}
      <form
        onSubmit={e => {
          e.preventDefault()
          crearNovedad()
        }}
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md space-y-4 mb-8"
      >
        <input
          type="text"
          placeholder="Título"
          value={form.titulo}
          onChange={e => setForm({ ...form, titulo: e.target.value })}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
          required
        />
        <textarea
          placeholder="Descripción"
          value={form.descripcion}
          onChange={e => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="URL de la imagen"
          value={form.imagenUrl}
          onChange={e => setForm({ ...form, imagenUrl: e.target.value })}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
        />
        <input
          type="date"
          value={form.fechaExpiracion.toISOString().slice(0, 10)}
          onChange={e => setForm({ ...form, fechaExpiracion: new Date(e.target.value) })}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
          required
        />
        <select
          value={form.categoria}
          onChange={e => setForm({ ...form, categoria: e.target.value })}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
          required
        >
          <option value="">Seleccione categoría</option>
          <option value="TH">TH</option>
          <option value="OP">OP</option>
          <option value="TL">TL</option>
        </select>
        <select
          value={form.prioridad}
          onChange={e => setForm({ ...form, prioridad: e.target.value })}
          className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
          required
        >
          <option value="">Seleccione prioridad</option>
          <option value="ALTA">ALTA</option>
          <option value="MEDIA">MEDIA</option>
          <option value="BAJA">BAJA</option>
        </select>
        <button
          type="submit"
          className="bg-[#ECB22E] hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold"
        >
          Crear Novedad
        </button>
      </form>

      {/* Lista de novedades */}
      {loading && <p className="text-black dark:text-gray-200">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-4">
        {novedades.map(n => (
          <li key={n.idNovedades} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
            <div>
              <h3 className="font-semibold text-black dark:text-gray-200">{n.titulo}</h3>
              <p className="text-gray-700 dark:text-gray-400">{n.descripcion}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Expira: {new Date(n.fechaExpiracion).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Categoría: {n.categoria}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Prioridad: {n.prioridad}</p>
            </div>
            {n.imagenUrl && (
              <img
                src={n.imagenUrl}
                alt={n.titulo}
                className="w-32 h-32 object-cover rounded"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
    </PageLayout>
  )
}
