    import { useEffect, useMemo, useState } from "react"
    import { useNavigate } from "react-router"
    import { useAuth } from "../../../app/providers/AuthContext"

    import GlassCard from "@/shared/ui/components/GlassCard"
    import DataTable from "@/shared/ui/components/DataTable"

    const API_URL = "http://localhost:8080/api/v1/admin/operations/proyectos"

    type ProyectoItem = {
    idProyecto: number
    nombre: string
    estado: "ACTIVO" | "PAUSADO" | "FINALIZADO" | string
    nombreLider?: string | null
    nombreEquipo?: string | null
    nombreCliente?: string | null
    activo?: boolean | null
    }

    function EstadoPill({ estado }: { estado: string }) {
    const classes = useMemo(() => {
        const e = (estado || "").toUpperCase()
        if (e === "ACTIVO") return "bg-green-100 text-green-700"
        if (e === "PAUSADO") return "bg-yellow-100 text-yellow-800"
        if (e === "FINALIZADO") return "bg-gray-200 text-gray-800"
        return "bg-slate-200 text-slate-800"
    }, [estado])

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
        {estado}
        </span>
    )
    }

    export default function ProyectosPage() {
    const { token } = useAuth()
    const navigate = useNavigate()

    const [proyectos, setProyectos] = useState<ProyectoItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!token) return

        const fetchProyectos = async () => {
        try {
            setLoading(true)
            setError(null)

            const res = await fetch(API_URL, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            })

            if (!res.ok) throw new Error("Error obteniendo proyectos")

            const data = await res.json()
            setProyectos(Array.isArray(data) ? data : [])
        } catch (e: any) {
            setError(e?.message ?? "Error inesperado")
        } finally {
            setLoading(false)
        }
        }

        fetchProyectos()
    }, [token])

    const eliminarProyecto = async (idProyecto: number) => {
        if (!token) return
        const ok = confirm("¿Seguro que deseas eliminar este proyecto?")
        if (!ok) return

        try {
        const res = await fetch(`${API_URL}/${idProyecto}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("No se pudo eliminar")

        setProyectos(prev =>
            prev.filter(p => p.idProyecto !== idProyecto)
        )
        } catch (e: any) {
        alert(e?.message ?? "Error eliminando")
        }
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
                Proyectos
                </h2>

                <button
                onClick={() => navigate("/operations/proyectos/nuevo")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                >
                <span className="material-symbols-outlined">add</span>
                Nuevo Proyecto
                </button>
            </div>
            <div className="h-px w-full bg-white/100 mb-6" />

            {loading && <div>Cargando proyectos…</div>}
            {error && <div className="text-red-600">{error}</div>}

            {!loading && !error && (
                <DataTable
                data={proyectos}
                rowKey={p => p.idProyecto}
                columns={[
                    { key: "nombre", label: "Nombre" },
                    {
                    key: "nombreCliente",
                    label: "Cliente",
                    render: p => p.nombreCliente ?? "-",
                    },
                    {
                    key: "nombreEquipo",
                    label: "Equipo",
                    render: p => p.nombreEquipo ?? "-",
                    },
                    {
                    key: "nombreLider",
                    label: "Líder",
                    render: p => p.nombreLider ?? "-",
                    },
                    {
                    key: "estado",
                    label: "Estado",
                    render: p => <EstadoPill estado={p.estado} />,
                    },
                ]}
                rowActions={[
                    {
                    key: "editar",
                    label: "Editar",
                    icon: (
                        <span className="material-symbols-outlined">
                        edit
                        </span>
                    ),
                    onClick: row =>
                        navigate(
                        `/operations/proyectos/${row.idProyecto}/edit`
                        ),
                    variant: "primary",
                    },
                    {
                    key: "eliminar",
                    label: "Eliminar",
                    icon: (
                        <span className="material-symbols-outlined">
                        delete
                        </span>
                    ),
                    onClick: row => eliminarProyecto(row.idProyecto),
                    variant: "danger",
                    },
                ]}
                />
            )}
            </GlassCard>
        </div>
        </div>
    )
    }
