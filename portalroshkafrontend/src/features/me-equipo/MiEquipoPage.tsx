    // src/features/me-equipo/MiEquipoPage.tsx
    import { useEffect, useState } from 'react'
    import PageLayout from '../../layouts/PageLayout'
    import { useAuth } from '../../app/providers/AuthContext'

    type Usuario = {
    nombre: string
    correo: string
    }

    type Equipo = {
    idEquipo: number
    nombre: string
    lider?: Usuario
    usuarios: Usuario[]
    }

    export default function MiEquipoPage() {
    const { token } = useAuth()
    const [equipos, setEquipos] = useState<Equipo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMiEquipo = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/v1/me/equipo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            })

            if (!res.ok) {
            const text = await res.text()
            throw new Error(text || 'Error al obtener el equipo')
            }

            const data = await res.json()
            setEquipos(Array.isArray(data) ? data : [data])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
        }

        fetchMiEquipo()
    }, [token])

    return (
        <PageLayout title="Mi Equipo">
        {loading && (
            <div className="text-center text-gray-500 dark:text-gray-300">
            Cargando equipo...
            </div>
        )}

        {error && (
            <div className="text-center text-red-500">
            {error}
            </div>
        )}

        {!loading && !error && equipos.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-300">
            No perteneces a ningún equipo.
            </div>
        )}

        <div className="space-y-6">
            {equipos.map((equipo) => (
            <div
                key={equipo.idEquipo}
                className="
                bg-white/45 dark:bg-gray-900/70
                backdrop-blur-xs
                rounded-2xl
                shadow-lg
                p-6
                border border-gray-200 dark:border-gray-700
                "
            >
                <h3 className="text-xl font-bold text-brand-blue dark:text-white mb-2">
                {equipo.nombre}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                <span className="font-semibold">Líder:</span>{' '}
                {equipo.lider?.nombre ?? 'No asignado'}
                </p>

                <div>
                <p className="font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Miembros del equipo
                </p>

                <ul className="space-y-2">
                    {equipo.usuarios.map((u, index) => (
                    <li
                        key={index}
                        className="
                        flex justify-between items-center
                        bg-white/60 dark:bg-gray-800/60
                        rounded-lg
                        px-4 py-2
                        text-sm
                        text-gray-800 dark:text-gray-200
                        "
                    >
                        <span>{u.nombre}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                        {u.correo}
                        </span>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            ))}
        </div>
        </PageLayout>
    )
    }
