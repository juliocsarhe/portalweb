    import { useEffect, useState } from "react"
    import { useNavigate, useParams } from "react-router"
    import { useAuth } from "../../../app/providers/AuthContext"

    import type { IUsuarioDisponible } from "../interfaces/IUsuarioDisponible"
    import type { IEquipo } from "../interfaces/IEquipo"

    const BASE_URL = "http://localhost:8080/api/v1/admin/operations"

    export default function EditarEquipoPage() {
    const { token } = useAuth()
    const { id } = useParams()
    const navigate = useNavigate()

    const [nombre, setNombre] = useState("")
    const [idLider, setIdLider] = useState<number | null>(null)
    const [estado, setEstado] = useState<"A" | "I">("A")
    const [selectedUsuarios, setSelectedUsuarios] = useState<number[]>([])

    const [usuarios, setUsuarios] = useState<IUsuarioDisponible[]>([])
    const [lideres, setLideres] = useState<IUsuarioDisponible[]>([])

    const [loadingEquipo, setLoadingEquipo] = useState(true)
    const [loadingUsuarios, setLoadingUsuarios] = useState(true)
    const [loadingLideres, setLoadingLideres] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!token || !id) return

        ;(async () => {
        try {
            const res = await fetch(`${BASE_URL}/equipos/${id}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            })

            if (!res.ok) throw new Error("No se encontró el equipo")

            const data: IEquipo = await res.json()

            setNombre(data.nombre)
            setEstado(data.estado)
            setIdLider(data.lider?.idUsuario ?? null)
            setSelectedUsuarios(data.usuarios.map((u) => u.idUsuario))
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoadingEquipo(false)
        }
        })()
    }, [id, token])

    useEffect(() => {
        if (!token) return

        ;(async () => {
        try {
            const res = await fetch(`${BASE_URL}/equipos/lideres`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            })

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
            const res = await fetch(`${BASE_URL}/usuarios-disponibles`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            })

            const data = await res.json()
            setUsuarios(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoadingUsuarios(false)
        }
        })()
    }, [token])

    const eliminarUsuario = (idUsuario: number) => {
        setSelectedUsuarios((prev) => prev.filter((id) => id !== idUsuario))
    }

    const toggleUsuario = (idUsuario: number) => {
        setSelectedUsuarios((prev) =>
        prev.includes(idUsuario)
            ? prev.filter((x) => x !== idUsuario)
            : [...prev, idUsuario]
        )
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!nombre.trim()) return setError("El nombre es obligatorio")
        if (!idLider) return setError("Debe seleccionar un líder")

        const body = {
        nombre,
        idLider,
        estado,
        usuarios: selectedUsuarios,
        }

        try {
        setSaving(true)

        const res = await fetch(`${BASE_URL}/equipos/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => null)
            throw new Error(errorData?.message || "Error al actualizar")
        }

        navigate("/operations/equipos")
        } catch (err: any) {
        setError(err.message)
        } finally {
        setSaving(false)
        }
    }

    if (loadingEquipo)
        return <p className="p-6 text-lg">Cargando datos del equipo...</p>

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
            <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-6 max-w-4xl mx-auto w-full">
            <h1 className="text-2xl font-bold text-brand-blue mb-6">
                Editar Equipo
            </h1>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label className="font-semibold">Nombre del Equipo</label>
                <input
                    className="w-full p-2 border rounded-lg mt-1"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                </div>

                <div>
                <label className="font-semibold">Líder</label>
                {loadingLideres ? (
                    <p>Cargando líderes...</p>
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
                <label className="font-semibold">Estado</label>
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
                <label className="font-semibold mb-2 block">
                    Miembros del Equipo
                </label>
                <table className="min-w-full border rounded text-sm">
                    <thead className="bg-[#085394] text-white">
                    <tr>
                        <th className="p-2">Nombre</th>
                        <th className="p-2">Correo</th>
                        <th className="p-2 text-center">Acción</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios
                        .filter((u) => selectedUsuarios.includes(u.idUsuario))
                        .map((u) => (
                        <tr key={u.idUsuario} className="border-b">
                            <td className="p-2">
                            {u.nombre} {u.apellido}
                            </td>
                            <td className="p-2">{u.correo}</td>
                            <td className="p-2 text-center">
                            <button
                                type="button"
                                onClick={() => eliminarUsuario(u.idUsuario)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-800 transition"
                            >
                                Quitar
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                </div>

                <div>
                <label className="font-semibold mb-2 block">
                    Agregar Usuarios
                </label>
                <table className="min-w-full border rounded text-sm">
                    <thead className="bg-[#085394] text-white">
                    <tr>
                        <th className="p-2 text-center">Sel.</th>
                        <th className="p-2">Nombre</th>
                        <th className="p-2">Correo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios
                        .filter((u) => !selectedUsuarios.includes(u.idUsuario))
                        .map((u) => (
                        <tr key={u.idUsuario} className="border-b">
                            <td className="p-2 text-center">
                            <input
                                type="checkbox"
                                onChange={() => toggleUsuario(u.idUsuario)}
                            />
                            </td>
                            <td className="p-2">
                            {u.nombre} {u.apellido}
                            </td>
                            <td className="p-2">{u.correo}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                </div>

                <div className="flex gap-4 pt-6">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-[#085394] text-white rounded-lg font-semibold hover:bg-[#064579] transition"
                >
                    {saving ? "Guardando..." : "Guardar Cambios"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/operations/equipos")}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 transition"
                >
                    Cancelar
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    )
    }
