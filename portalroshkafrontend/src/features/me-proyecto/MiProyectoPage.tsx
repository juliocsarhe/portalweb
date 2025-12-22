    import { useEffect, useState } from 'react'
    import PageLayout from '@/layouts/PageLayout'
    import { useAuth } from '@/app/providers/AuthContext'

    type Tecnologia = {
    idTecnologia: number
    nombre: string
    }

    type Proyecto = {
    idProyecto: number
    nombre: string
    descripcion?: string
    nombreEquipo?: string
    nombreLider?: string
    tecnologias?: Tecnologia[]
    }

    const BASE_URL = 'http://localhost:8080/api/v1/me/proyectos'

    export default function MiProyectoPage() {
    const { token } = useAuth()

    const [proyectos, setProyectos] = useState<Proyecto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!token) return

        const fetchProyectos = async () => {
        try {
            setLoading(true)
            setError(null)

            const res = await fetch(BASE_URL, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            })

            if (!res.ok) {
            const text = await res.text()
            throw new Error(text || 'Error al cargar proyectos')
            }

            const data = await res.json()
            setProyectos(Array.isArray(data) ? data : [])
        } catch (e: any) {
            setError(e.message ?? 'Error inesperado')
        } finally {
            setLoading(false)
        }
        }

        fetchProyectos()
    }, [token])

    return (
        <PageLayout title="Mis Proyectos">
        {loading && (
            <div className="text-gray-600 dark:text-gray-300">
            Cargando proyectos…
            </div>
        )}

        {error && (
            <div className="text-red-600 dark:text-red-400">
            {error}
            </div>
        )}

        {!loading && !error && proyectos.length === 0 && (
            <div className="text-gray-600 dark:text-gray-400">
            No estás asignado a ningún proyecto.
            </div>
        )}

        <div className="space-y-6">
            {proyectos.map((p) => (
            <div
                key={p.idProyecto}
                className="
                rounded-xl border border-gray-200 dark:border-gray-700
                bg-white/60 dark:bg-gray-900/60
                backdrop-blur-sm
                p-6
                "
            >
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {p.nombre}
                </h3>

                {p.descripcion && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {p.descripcion}
                </p>
                )}

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                    <span className="font-semibold text-gray-500 dark:text-gray-400">
                    Equipo
                    </span>
                    <p className="text-gray-800 dark:text-white">
                    {p.nombreEquipo ?? '—'}
                    </p>
                </div>

                <div>
                    <span className="font-semibold text-gray-500 dark:text-gray-400">
                    Líder
                    </span>
                    <p className="text-gray-800 dark:text-white">
                    {p.nombreLider ?? '—'}
                    </p>
                </div>
                </div>

                {/* Tecnologías */}
                <div className="mt-4">
                <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">
                    Tecnologías
                </span>

                <div className="flex flex-wrap gap-2 mt-2">
                    {p.tecnologias && p.tecnologias.length > 0 ? (
                    p.tecnologias.map((t) => (
                        <span
                        key={t.idTecnologia}
                        className="
                            px-3 py-1 rounded-full text-xs font-medium
                            bg-blue-100 text-blue-700
                            dark:bg-blue-600/20 dark:text-blue-300
                        "
                        >
                        {t.nombre}
                        </span>
                    ))
                    ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        No definidas
                    </span>
                    )}
                </div>
                </div>
            </div>
            ))}
        </div>
        </PageLayout>
    )
    }
