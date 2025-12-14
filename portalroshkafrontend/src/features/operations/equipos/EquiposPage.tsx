import { useEffect, useState } from "react"; 
import { useNavigate } from 'react-router'
import { useAuth } from '../../../app/providers/AuthContext'
import type { IEquipo } from '../interfaces/IEquipo'

const BASE_URL = 'http://localhost:8080/api/v1/admin/operations/equipos'

export default function EquiposPage(){
    const navigate = useNavigate()
    const { token } = useAuth()

    const [equipos, setEquipos] = useState<IEquipo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [detalle, setDetalle] = useState<IEquipo | null>(null)
    const [detalleLoading, setDetalleLoading] = useState(false)
    const [detalleError, setDetalleError] = useState<string | null>(null)

    //Cargar lista de equipos

    useEffect(() => {
    const ac = new AbortController()

        ;(async () => {
        try {
            setLoading(true)
            setError(null)

            const res = await fetch(BASE_URL, {
            headers: {
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
            signal: ac.signal,
            })

            if (!res.ok) {
            const txt = await res.text()
            throw new Error(`${res.status} ${res.statusText} — ${txt.slice(0, 200)}`)
            }

            const data: IEquipo[] = await res.json()
            setEquipos(Array.isArray(data) ? data : [])
        } catch (e: any) {
            if (e?.name !== 'AbortError') {
            setError(e.message || 'Error al cargar equipos')
            }
        } finally {
            setLoading(false)
        }
        })()

        return () => ac.abort()
    }, [token])

        //Cambiar Estado

            const handleToggleEstado = async (equipo: IEquipo) => {
        try {
        const res = await fetch(`${BASE_URL}/${equipo.idEquipo}/toggle`, {
            method: 'PATCH',
            headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
        })

        if (!res.ok) {
            const txt = await res.text()
            throw new Error(`${res.status} ${res.statusText} — ${txt.slice(0, 200)}`)
        }

        // Actualizar estado en memoria
        setEquipos((prev) =>
            prev.map((e) =>
            e.idEquipo === equipo.idEquipo
                ? { ...e, estado: e.estado === 'A' ? 'I' : 'A' }
                : e
            )
        )
        } catch (e: any) {
        setError(e.message || 'Error al cambiar estado del equipo')
        }
    }

        //Ver detalle

            const abrirDetalle = async (idEquipo: number) => {
        setDetalle(null)
        setDetalleError(null)
        setDetalleLoading(true)

        try {
        const res = await fetch(`${BASE_URL}/${idEquipo}`, {
            headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: 'include',
        })

        if (!res.ok) {
            const txt = await res.text()
            throw new Error(`${res.status} ${res.statusText} — ${txt.slice(0, 200)}`)
        }

        const data: IEquipo = await res.json()
        setDetalle(data)
        } catch (e: any) {
        setDetalleError(e.message || 'Error al cargar detalle del equipo')
        } finally {
        setDetalleLoading(false)
        }
    }

    const cerrarDetalle = () => {
        setDetalle(null)
        setDetalleError(null)
    }

    // Helpers

        const formatFecha = (iso: string | null | undefined) => {
        if (!iso) return '—'
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return iso
        return d.toLocaleString()
    }

    const getEstadoLabel = (estado: 'A' | 'I') => (estado === 'A' ? 'Activo' : 'Inactivo')

    const getEstadoClasses = (estado: 'A' | 'I') =>
        estado === 'A'
        ? 'px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700'
        : 'px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700'

          // Render

            return (
        <div className="h-full flex flex-col overflow-hidden">
        {/* Fondo como en otras páginas */}
        <div
            className="absolute inset-0 bg-brand-blue"
            style={{
            backgroundImage: "url('/src/assets/ilustracion-herov3.svg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="absolute inset-0 bg-brand-blue/40" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-4">
            <div className="bg-white/60 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-brand-blue dark:text-blue-200">
                    Equipos
                </h2>

                    <button
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#085394] text-white font-medium shadow hover:bg-[#064579] transition"
                        onClick={() => navigate('/operations/equipos/nuevo')}
                        >
                        <span className="material-symbols-outlined text-base">add</span>
                        Nuevo Equipo
                    </button>
                </div>
            </div>

            {/* Contenido */}
            <div className="flex-1 overflow-auto p-6">
                {loading && (
                <div className="text-sm text-gray-700 dark:text-gray-200">Cargando equipos…</div>
                )}

                {error && (
                <div className="text-sm text-red-600 dark:text-red-400">
                    Error: {error}
                </div>
                )}

                {!loading && !error && equipos.length === 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                    No hay equipos registrados.
                </div>
                )}

                {!loading && !error && equipos.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-[#085394] text-white">
                        <th className="px-3 py-2 text-left">Nombre</th>
                        <th className="px-3 py-2 text-left">Lider</th>
                        <th className="px-3 py-2 text-left">Estado</th>
                        <th className="px-3 py-2 text-left">Fecha creacion</th>
                        <th className="px-3 py-2 text-center">Miembros</th>
                        <th className="px-3 py-2 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipos.map((eq) => {
                        const liderNombre = eq.lider
                            ? `${eq.lider.nombre} ${eq.lider.apellido}`.trim()
                            : '—'
                        const cantMiembros = eq.usuarios?.length ?? 0

                        return (
                            <tr
                                key={eq.idEquipo}
                                className="border-b border-white/10 
                                            text-gray-900 dark:text-gray-100
                                            hover:bg-white/10 dark:hover:bg-white/10
                                            transition"
                                >

                            <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                                {eq.nombre}
                            </td>
                            <td className="px-3 py-2">{liderNombre}</td>
                            <td className="px-3 py-2">
                                <span className={getEstadoClasses(eq.estado)}>
                                {getEstadoLabel(eq.estado)}
                                </span>
                            </td>
                            <td className="px-3 py-2">
                                {formatFecha(eq.fechaCreacion)}
                            </td>
                            <td className="px-3 py-2 text-center">
                                {cantMiembros}
                            </td>
                            <td className="px-3 py-2">
                                <div className="flex justify-center gap-3">
                                {/* Ver */}
                                <button
                                    onClick={() => abrirDetalle(eq.idEquipo)}
                                    className="p-2 hover:bg-yellow-100 text-yellow-700 rounded-full transition"
                                    title="Ver detalles"
                                >
                                    <span className="material-symbols-outlined">visibility</span>
                                </button>

                                {/* Editar */}
                                <button
                                    onClick={() => navigate(`/operations/equipos/${eq.idEquipo}/edit`)}
                                    className="p-2 hover:bg-blue-100 text-blue-600 rounded-full transition"
                                    title="Editar"
                                >
                                    <span className="material-symbols-outlined">edit</span>
                                </button>

                                {/* Cambiar estado */}
                                <button
                                    onClick={() => handleToggleEstado(eq)}
                                    className="p-2 hover:bg-gray-200 text-gray-600 rounded-full transition"
                                    title="Cambiar estado"
                                >
                                    <span className="material-symbols-outlined">autorenew</span>
                                </button>

                                </div>
                            </td>
                            </tr>
                        )
                        })}
                    </tbody>
                    </table>
                </div>
                )}
            </div>
            </div>
        </div>

        {/* Modal de Detalle */}
        {detalle && (
            <DetalleEquipoModal
            equipo={detalle}
            loading={detalleLoading}
            error={detalleError}
            onClose={cerrarDetalle}
            />
        )}

        {/* Si se está cargando el detalle pero aún no hay data, mostramos un modal simple */}
        {!detalle && detalleLoading && (
            <DetalleEquipoModal
            equipo={null}
            loading={detalleLoading}
            error={detalleError}
            onClose={cerrarDetalle}
            />
        )}
        </div>
    )
    }

    // Modal Detalle

        type DetalleProps = {
    equipo: IEquipo | null
    loading: boolean
    error: string | null
    onClose: () => void
    }

    function DetalleEquipoModal({ equipo, loading, error, onClose }: DetalleProps) {
    // Evitar mostrar modal vacío si no se pidió aún
    if (!equipo && !loading && !error) return null

    const formatFecha = (iso: string | null | undefined) => {
        if (!iso) return '—'
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return iso
        return d.toLocaleString()
    }

    const estado = equipo?.estado ?? 'A'
    const estadoLabel = estado === 'A' ? 'Activo' : 'Inactivo'
    const estadoClasses =
        estado === 'A'
        ? 'px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700'
        : 'px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700'

    const liderNombre = equipo?.lider
        ? `${equipo.lider.nombre} ${equipo.lider.apellido}`.trim()
        : '—'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative z-10 w-full max-w-3xl mx-4 rounded-2xl shadow-xl bg-white dark:bg-gray-900">
            
            <div className="flex items-start justify-between p-4 border-b bg-[#085394] text-white">
                <div>
                    <h3 className="text-lg font-bold">
                        {equipo?.nombre ?? 'Equipo'}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-white/20">
                            {estadoLabel}
                        </span>

                        {equipo?.fechaCreacion && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-white/20">
                                Creado: {formatFecha(equipo.fechaCreacion)}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-white hover:bg-white/20 transition"
                    aria-label="Cerrar"
                >
                    ✕
                </button>
            </div>

            <div className="p-4 space-y-3 max-h-[70vh] overflow-auto">
            {loading && (
                <div className="text-sm text-gray-700 dark:text-gray-200">
                Cargando detalles del equipo…
                </div>
            )}

            {error && (
                <div className="text-sm text-red-600 dark:text-red-400">
                Error: {error}
                </div>
            )}

            {!loading && !error && equipo && (
                <>
                <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Líder
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-100">
                    {liderNombre}
                    {equipo.lider?.correo && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({equipo.lider.correo})
                        </span>
                    )}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Miembros del equipo
                    </p>
                    {equipo.usuarios && equipo.usuarios.length > 0 ? (
                    <ul className="text-sm text-gray-800 dark:text-gray-100 list-disc pl-5 space-y-1">
                        {equipo.usuarios.map((u) => (
                        <li key={u.idUsuario}>
                            {u.nombre} {u.apellido}
                            {u.correo && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                ({u.correo})
                            </span>
                            )}
                        </li>
                        ))}
                    </ul>
                    ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No hay usuarios asignados a este equipo.
                    </p>
                    )}
                </div>
                </>
            )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-[#085394] text-white font-medium shadow hover:bg-[#064579] transition"
                >
                    Cerrar
                </button>
            </div>
        </div>
        </div>
    )
    }


    
