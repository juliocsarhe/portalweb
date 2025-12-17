    import { useEffect, useState } from "react"
    import { useNavigate } from "react-router"
    import { useAuth } from "../../../app/providers/AuthContext"
    import type { IEquipo } from "../interfaces/IEquipo"

    import GlassCard from "@/shared/ui/components/GlassCard"
    import DataTable from "@/shared/ui/components/DataTable"

    const BASE_URL = "http://localhost:8080/api/v1/admin/operations/equipos"

    export default function EquiposPage() {
    const navigate = useNavigate()
    const { token } = useAuth()

    const [equipos, setEquipos] = useState<IEquipo[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [detalle, setDetalle] = useState<IEquipo | null>(null)
    const [detalleLoading, setDetalleLoading] = useState(false)
    const [detalleError, setDetalleError] = useState<string | null>(null)

    useEffect(() => {
        if (!token) return

        const fetchEquipos = async () => {
        try {
            setLoading(true)
            setError(null)

            const res = await fetch(BASE_URL, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            })

            if (!res.ok) throw new Error("Error al cargar equipos")

            const data = await res.json()
            setEquipos(Array.isArray(data) ? data : [])
        } catch (e: any) {
            setError(e?.message ?? "Error inesperado")
        } finally {
            setLoading(false)
        }
        }

        fetchEquipos()
    }, [token])

    const toggleEstado = async (equipo: IEquipo) => {
        try {
        const res = await fetch(`${BASE_URL}/${equipo.idEquipo}/toggle`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("No se pudo cambiar el estado")

        setEquipos((prev) =>
            prev.map((e) =>
            e.idEquipo === equipo.idEquipo
                ? { ...e, estado: e.estado === "A" ? "I" : "A" }
                : e
            )
        )
        } catch (e: any) {
        alert(e?.message ?? "Error cambiando estado")
        }
    }

    const abrirDetalle = async (idEquipo: number) => {
        setDetalle(null)
        setDetalleError(null)
        setDetalleLoading(true)

        try {
        const res = await fetch(`${BASE_URL}/${idEquipo}`, {
            headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) throw new Error("Error al cargar detalle")

        const data: IEquipo = await res.json()
        setDetalle(data)
        } catch (e: any) {
        setDetalleError(e?.message ?? "Error al cargar detalle")
        } finally {
        setDetalleLoading(false)
        }
    }

    const cerrarDetalle = () => {
        setDetalle(null)
        setDetalleError(null)
    }

    return (
        <div className="h-full w-full relative overflow-hidden">
        <div
            className="absolute inset-0"
            style={{
            backgroundImage: "url('/src/assets/ilustracion-herov3.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        />
        <div className="absolute inset-0 bg-[#085394]/55" />

        <div className="relative z-10 h-full w-full p-4">
            <GlassCard className="h-full w-full p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#083b6a] dark:text-white">
                Equipos
                </h2>

                <button
                onClick={() => navigate("/operations/equipos/nuevo")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                <span className="material-symbols-outlined">add</span>
                Nuevo Equipo
                </button>
            </div>

            <div className="h-px w-full bg-white/100 mb-6" />

            {loading && <div>Cargando equipos…</div>}
            {error && <div className="text-red-600">{error}</div>}

            {!loading && !error && (
                <DataTable
                data={equipos}
                rowKey={(e) => e.idEquipo}
                columns={[
                    { key: "nombre", label: "Nombre" },
                    {
                    key: "lider",
                    label: "Líder",
                    render: (e) =>
                        e.lider
                        ? `${e.lider.nombre} ${e.lider.apellido}`
                        : "—",
                    },
                    {
                    key: "estado",
                    label: "Estado",
                    render: (e) => (
                        <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                            e.estado === "A"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                        >
                        {e.estado === "A" ? "Activo" : "Inactivo"}
                        </span>
                    ),
                    },
                    {
                    key: "usuarios",
                    label: "Miembros",
                    render: (e) => e.usuarios?.length ?? 0,
                    },
                ]}
                rowActions={[
                    {
                    key: "ver",
                    label: "Ver",
                    icon: (
                        <span className="material-symbols-outlined">
                        visibility
                        </span>
                    ),
                    onClick: (row) => abrirDetalle(row.idEquipo),
                    },
                    {
                    key: "editar",
                    label: "Editar",
                    icon: (
                        <span className="material-symbols-outlined">edit</span>
                    ),
                    onClick: (row) =>
                        navigate(`/operations/equipos/${row.idEquipo}/edit`),
                    variant: "primary",
                    },
                    {
                    key: "estado",
                    label: "Cambiar estado",
                    icon: (
                        <span className="material-symbols-outlined">
                        autorenew
                        </span>
                    ),
                    onClick: (row) => toggleEstado(row),
                    variant: "secondary",
                    },
                ]}
                />
            )}
            </GlassCard>
        </div>

        {detalle && (
            <DetalleEquipoModal
            equipo={detalle}
            loading={detalleLoading}
            error={detalleError}
            onClose={cerrarDetalle}
            />
        )}
        </div>
    )
    }

    type DetalleProps = {
    equipo: IEquipo | null
    loading: boolean
    error: string | null
    onClose: () => void
    }

    function DetalleEquipoModal({
    equipo,
    loading,
    error,
    onClose,
    }: DetalleProps) {
    if (!equipo && !loading && !error) return null


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div
            className="
            w-full max-w-2xl rounded-2xl p-6 shadow-xl
            bg-white text-gray-800
            dark:bg-slate-900 dark:text-slate-200
            "
        >
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Detalle del Equipo
            </h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 dark:text-slate-300 dark:hover:text-white"
            >
                ✕
            </button>
            </div>

            {loading && (
            <div className="text-gray-600 dark:text-slate-300">
                Cargando...
            </div>
            )}

            {error && (
            <div className="text-red-600 dark:text-red-400">
                {error}
            </div>
            )}

            {!loading && !error && equipo && (
            <div className="space-y-4 text-sm">

                <div>
                <span className="font-medium text-gray-500 dark:text-slate-400">
                    Nombre
                </span>
                <p>{equipo.nombre}</p>
                </div>

                <div>
                <span className="font-medium text-gray-500 dark:text-slate-400">
                    Líder del equipo
                </span>
                <p>
                    {equipo.lider
                    ? `${equipo.lider.nombre} ${equipo.lider.apellido}`
                    : "-"}
                </p>
                </div>

                <div>
                <span className="font-medium text-gray-500 dark:text-slate-400">
                    Miembros del equipo
                </span>

                <div className="space-y-2 mt-2">
                    {equipo.usuarios?.length ? (
                    equipo.usuarios.map((u) => (
                        <div
                        key={u.idUsuario}
                        className="
                            rounded-lg px-4 py-2
                            bg-gray-100 text-gray-800
                            dark:bg-slate-800 dark:text-slate-200
                        "
                        >
                        <p>
                            {u.nombre} {u.apellido}
                        </p>
                        {u.correo && (
                            <p className="text-xs text-gray-600 dark:text-slate-400">
                            {u.correo}
                            </p>
                        )}
                        </div>
                    ))
                    ) : (
                    <span className="text-gray-500 dark:text-slate-400">
                        No hay miembros asignados
                    </span>
                    )}
                </div>
                </div>

            </div>
            )}

            <div className="flex justify-end mt-6">
            <button
                onClick={onClose}
                className="
                px-4 py-2 rounded-lg font-medium
                bg-gray-200 text-gray-800 hover:bg-gray-300
                dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600
                "
            >
                Cerrar
            </button>
            </div>
        </div>
        </div>
    )
    }
    