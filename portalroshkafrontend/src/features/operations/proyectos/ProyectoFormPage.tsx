    import { useEffect, useState } from "react"
    import { useNavigate, useParams } from "react-router"
    import { useAuth } from "../../../app/providers/AuthContext"

    const API_PROYECTOS = "http://localhost:8080/api/v1/admin/operations/proyectos"
    const API_CLIENTES = "http://localhost:8080/api/v1/admin/operations/clientes"
    const API_EQUIPOS = "http://localhost:8080/api/v1/admin/operations/equipos"

    export default function ProyectoFormPage() {
    const { token } = useAuth()
    const navigate = useNavigate()
    const { id } = useParams()
    const editar = Boolean(id)

    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    const [clientes, setClientes] = useState<any[]>([])
    const [equipos, setEquipos] = useState<any[]>([])

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaLimite: "",
        idCliente: "",
        idEquipo: "",
        estado: "ACTIVO",
    })

    /* =========================================================
        CARGAR CLIENTES
    ========================================================= */
    useEffect(() => {
    if (!token) return

        fetch(API_CLIENTES, {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data?.content)) {
            setClientes(data.content)
            } else {
            setClientes([])
            }
        })
        .catch(() => setClientes([]))
    }, [token])

    /* =========================================================
        CARGAR EQUIPOS
    ========================================================= */
    useEffect(() => {
        if (!token) return

        fetch(API_EQUIPOS, {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setEquipos(data)
            else setEquipos([])
        })
        .catch(() => setEquipos([]))
    }, [token])

    /* =========================================================
        CARGAR PROYECTO (EDITAR)
    ========================================================= */
    useEffect(() => {
        if (!editar || !token) return

        fetch(`${API_PROYECTOS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
            setForm({
            nombre: data.nombre ?? "",
            descripcion: data.descripcion ?? "",
            fechaInicio: data.fechaInicio ?? "",
            fechaLimite: data.fechaLimite ?? "",
            idCliente: String(data.idCliente ?? ""),
            idEquipo: String(data.idEquipo ?? ""),
            estado: data.estado ?? "ACTIVO",
            })
        })
    }, [editar, id, token])

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    /* =========================================================
        GUARDAR
    ========================================================= */
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setError(null)

        if (!form.nombre.trim()) return setError("El nombre es obligatorio")
        if (!form.idCliente) return setError("Debe seleccionar un cliente")
        if (!form.idEquipo) return setError("Debe seleccionar un equipo")

        const payload = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion,
        fechaInicio: form.fechaInicio || null,
        fechaLimite: form.fechaLimite || null,
        idCliente: Number(form.idCliente),
        idEquipo: Number(form.idEquipo),
        tecnologiasIds: [],
        estado: form.estado,
        activo: true,
        }

        try {
        setSaving(true)

        const res = await fetch(editar ? `${API_PROYECTOS}/${id}` : API_PROYECTOS, {
            method: editar ? "PUT" : "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            const txt = await res.text()
            throw new Error(txt || "Error al guardar el proyecto")
        }

        navigate("/operations/proyectos")
        } catch (err: any) {
        setError(err.message)
        } finally {
        setSaving(false)
        }
    }

    /* =========================================================
        UI
    ========================================================= */
    return (
        <div className="h-full flex flex-col overflow-y-auto">
        {/* FONDO */}
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
            <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-6 max-w-3xl mx-auto w-full">

            <h2 className="text-2xl font-bold text-brand-blue mb-4">
                {editar ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
            </h2>

            {error && (
                <div className="px-4 py-2 mb-4 bg-red-100 text-red-700 rounded">
                {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                <label className="block font-semibold">Nombre del Proyecto</label>
                <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg mt-1"
                />
                </div>

                <div>
                <label className="block font-semibold">Descripción</label>
                <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-2 border rounded-lg mt-1"
                />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-semibold">Fecha Inicio</label>
                    <input
                    type="date"
                    name="fechaInicio"
                    value={form.fechaInicio}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg mt-1"
                    />
                </div>

                <div>
                    <label className="block font-semibold">Fecha Límite</label>
                    <input
                    type="date"
                    name="fechaLimite"
                    value={form.fechaLimite}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg mt-1"
                    />
                </div>
                </div>

                <div>
                <label className="block font-semibold">Cliente</label>
                <select
                    name="idCliente"
                    value={form.idCliente}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg mt-1"
                >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(c => (
                    <option key={c.idCliente} value={c.idCliente}>
                        {c.nombre}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block font-semibold">Equipo</label>
                <select
                    name="idEquipo"
                    value={form.idEquipo}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg mt-1"
                >
                    <option value="">Seleccione un equipo</option>
                    {equipos.map(e => (
                    <option key={e.idEquipo} value={e.idEquipo}>
                        {e.nombre} — Líder: {e.lider?.nombre}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block font-semibold">Estado</label>
                <select
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg mt-1"
                >
                    <option value="ACTIVO">Activo</option>
                    <option value="PAUSADO">Pausado</option>
                    <option value="FINALIZADO">Finalizado</option>
                </select>
                </div>

                <div className="flex justify-between pt-6">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-[#085394] text-white rounded-lg font-semibold hover:bg-[#064579]"
                >
                    {saving ? "Guardando..." : "Guardar Proyecto"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/operations/proyectos")}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700"
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
