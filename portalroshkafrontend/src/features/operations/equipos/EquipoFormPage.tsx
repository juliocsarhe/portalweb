    import { useEffect, useState } from "react"
    import { useNavigate } from "react-router"
    import { useAuth } from "../../../app/providers/AuthContext"

    const BASE_URL = "http://localhost:8080/api/v1/admin/operations"

    type UsuarioDisponible = {
    idUsuario: number
    nombre: string
    apellido: string
    correo: string
    rolNombre: string
    telefono?: string
    disponibilidad?: number
    }

    export default function EquipoFormPage() {
    const navigate = useNavigate()
    const { token } = useAuth()

    const [nombre, setNombre] = useState("")
    const [idLider, setIdLider] = useState<number | null>(null)
    const [estado, setEstado] = useState<"A" | "I">("A")

    const [lideres, setLideres] = useState<any[]>([])
    const [usuarios, setUsuarios] = useState<UsuarioDisponible[]>([])
    const [selectedUsuarios, setSelectedUsuarios] = useState<number[]>([])

    const [loadingLideres, setLoadingLideres] = useState(true)
    const [loadingUsuarios, setLoadingUsuarios] = useState(true)

    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!token) return

        ;(async () => {
        try {
            setLoadingLideres(true)
            const res = await fetch(`${BASE_URL}/equipos/lideres`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            })

            if (!res.ok) {
            throw new Error("No se pudieron cargar los líderes")
            }

            const data = await res.json()
            setLideres(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoadingLideres(false)
        }
        })()
    }, [token])

    useEffect(() => {
        if (!token) return

        ;(async () => {
        try {
            setLoadingUsuarios(true)
            const res = await fetch(`${BASE_URL}/usuarios-disponibles`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            })

            if (!res.ok) throw new Error("Error al cargar usuarios disponibles")

            const data = await res.json()
            setUsuarios(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoadingUsuarios(false)
        }
        })()
    }, [token])

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!nombre.trim()) {
        setError("El nombre es obligatorio")
        return
        }

        if (!idLider) {
        setError("Debe seleccionar un líder")
        return
        }

        const body = {
        nombre,
        idLider,
        estado,
        usuarios: selectedUsuarios,
        }

        try {
        setSaving(true)
        setError(null)

        const res = await fetch(`${BASE_URL}/equipos`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const errorData = await res.json()
            setError(errorData.message || "No se pudo crear el equipo")
            return
        }

        navigate("/operations/equipos")
        } catch (err: any) {
        setError(err.message)
        } finally {
        setSaving(false)
        }
    }

    const toggleUsuario = (id: number) => {
        setSelectedUsuarios((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        )
    }

    return (
        <div className="h-full flex flex-col overflow-y-auto">
        <div
            className="absolute inset-0 bg-brand-blue"
            style={{
            backgroundImage: "url('/src/assets/ilustracion-herov3.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-brand-blue/40" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-4">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-brand-blue mb-4">
                Crear Nuevo Equipo
            </h2>

            {error && (
                <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-sm text-red-700">
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label className="block text-sm font-semibold">
                    Nombre del Equipo
                </label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 border rounded-lg mt-1"
                    placeholder="Ej: Equipo Backend"
                />
                </div>

                <div>
                <label className="block text-sm font-semibold">Líder</label>

                {loadingLideres ? (
                    <p>Cargando líderes…</p>
                ) : (
                    <select
                    className="w-full p-2 border rounded-lg mt-1"
                    value={idLider ?? ""}
                    onChange={(e) => setIdLider(Number(e.target.value))}
                    >
                    <option value="">Seleccione un líder</option>
                    {lideres.map((l) => (
                        <option key={l.idUsuario} value={l.idUsuario}>
                        {l.nombre} {l.apellido}
                        </option>
                    ))}
                    </select>
                )}
                </div>

                <div>
                <label className="block text-sm font-semibold">Estado</label>
                <select
                    className="w-full p-2 border rounded-lg mt-1"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as "A" | "I")}
                >
                    <option value="A">Activo</option>
                    <option value="I">Inactivo</option>
                </select>
                </div>

                <div>
                <h3 className="font-semibold mb-2 text-brand-blue">
                    Seleccionar Miembros
                </h3>

                {loadingUsuarios && <p>Cargando usuarios…</p>}

                {!loadingUsuarios && usuarios.length === 0 && (
                    <p>No hay usuarios disponibles.</p>
                )}

                {!loadingUsuarios && usuarios.length > 0 && (
                    <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                    <thead className="bg-[#085394] text-white">
                        <tr>
                        <th className="px-3 py-2">Sel.</th>
                        <th className="px-3 py-2">Nombre</th>
                        <th className="px-3 py-2">Correo</th>
                        <th className="px-3 py-2">Rol</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios
                        .filter(
                            (u) =>
                            u.rolNombre === "DESARROLLO" ||
                            u.rolNombre === "TEAM_LEADER"
                        )
                        .map((u) => (
                            <tr
                            key={u.idUsuario}
                            className="border-b hover:bg-blue-50"
                            >
                            <td className="px-3 py-2 text-center">
                                <input
                                type="checkbox"
                                checked={selectedUsuarios.includes(u.idUsuario)}
                                onChange={() => toggleUsuario(u.idUsuario)}
                                />
                            </td>
                            <td className="px-3 py-2">
                                {u.nombre} {u.apellido}
                            </td>
                            <td className="px-3 py-2">{u.correo}</td>
                            <td className="px-3 py-2">{u.rolNombre}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                )}
                </div>

                <div className="flex items-center justify-between pt-6">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 rounded-lg bg-[#085394] text-white font-semibold hover:bg-[#064579] transition"
                >
                    {saving ? "Guardando..." : "Crear Equipo"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/operations/equipos")}
                    className="px-6 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-700 transition"
                >
                    Volver
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    )
    }
