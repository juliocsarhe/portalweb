    import { useEffect, useMemo, useState } from "react";
    import { useNavigate } from "react-router";
    import { useAuth } from "../../../app/providers/AuthContext";

    const API_URL = "http://localhost:8080/api/v1/admin/operations/proyectos";

    type ProyectoItem = {
    idProyecto: number;
    nombre: string;
    estado: "ACTIVO" | "PAUSADO" | "FINALIZADO" | string;
    nombreLider?: string | null;
    nombreEquipo?: string | null;
    nombreCliente?: string | null;
    activo?: boolean | null;
    };

    function EstadoPill({ estado }: { estado: string }) {
    const classes = useMemo(() => {
        const e = (estado || "").toUpperCase();
        if (e === "ACTIVO") return "bg-green-100 text-green-700";
        if (e === "PAUSADO") return "bg-yellow-100 text-yellow-800";
        if (e === "FINALIZADO") return "bg-gray-200 text-gray-800";
        return "bg-slate-200 text-slate-800";
    }, [estado]);

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classes}`}>
        {estado}
        </span>
    );
    }

    export default function ProyectosPage() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [proyectos, setProyectos] = useState<ProyectoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const fetchProyectos = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(API_URL, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            });

            if (!res.ok) throw new Error("Error obteniendo proyectos");

            const data = await res.json();
            setProyectos(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err?.message ?? "Error inesperado");
        } finally {
            setLoading(false);
        }
        };

        fetchProyectos();
    }, [token]);

    const eliminarProyecto = async (idProyecto: number) => {
        if (!token) return;
        const ok = confirm("¿Seguro que deseas eliminar este proyecto?");
        if (!ok) return;

        try {
        const res = await fetch(`${API_URL}/${idProyecto}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt || "No se pudo eliminar");
        }

        setProyectos((prev) => prev.filter((p) => p.idProyecto !== idProyecto));
        } catch (e: any) {
        alert(e?.message ?? "Error eliminando");
        }
    };

    return (
        <div className="h-full w-full relative overflow-hidden">
        {/* FONDO (igual estilo que Equipos) */}
        <div
            className="absolute inset-0"
            style={{
            backgroundImage: "url('/src/assets/ilustracion-herov3.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        />
        <div className="absolute inset-0 bg-[#085394]/55" />

        {/* CONTENIDO */}
        <div className="relative z-10 h-full w-full p-4">
            {/* Panel grande */}
            <div className="h-full w-full rounded-2xl bg-white/40 backdrop-blur-md shadow-xl border border-white/30 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold text-[#083b6a]">
                Proyectos
                </h1>

                <button
                onClick={() => navigate("/operations/proyectos/nuevo")}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0b63b6] text-white font-semibold hover:bg-[#084f92] transition"
                >
                <span className="text-xl leading-none">+</span>
                Nuevo Proyecto
                </button>
            </div>

            {/* Estados */}
            {loading && (
                <div className="p-4 bg-white/60 rounded-lg">Cargando...</div>
            )}

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
                {error}
                </div>
            )}

            {!loading && proyectos.length === 0 && (
                <div className="p-4 bg-white/60 rounded-lg">
                No hay proyectos registrados.
                </div>
            )}

            {/* Tabla estilo Equipos */}
            {!loading && proyectos.length > 0 && (
                <div className="overflow-auto rounded-xl border border-white/30">
                <table className="w-full text-sm">
                    <thead className="bg-[#085394] text-white">
                    <tr>
                        <th className="p-3 text-left font-bold">Nombre</th>
                        <th className="p-3 text-left font-bold">Cliente</th>
                        <th className="p-3 text-left font-bold">Equipo</th>
                        <th className="p-3 text-left font-bold">Líder</th>
                        <th className="p-3 text-left font-bold">Estado</th>
                        <th className="p-3 text-center font-bold">Acciones</th>
                    </tr>
                    </thead>

                    <tbody>
                    {proyectos.map((p) => (
                        <tr
                        key={p.idProyecto}
                        className="border-b border-white/30 bg-white/25 hover:bg-white/35 transition"
                        >
                        <td className="p-3">{p.nombre}</td>
                        <td className="p-3">{p.nombreCliente ?? "-"}</td>
                        <td className="p-3">{p.nombreEquipo ?? "-"}</td>
                        <td className="p-3">{p.nombreLider ?? "-"}</td>

                        <td className="p-3">
                            <EstadoPill estado={p.estado ?? "-"} />
                        </td>

                        <td className="p-3">
                            <div className="flex items-center justify-center gap-3">
                            <button
                                className="text-blue-700 hover:underline font-semibold"
                                onClick={() =>
                                navigate(`/operations/proyectos/${p.idProyecto}/edit`)
                                }
                                title="Editar"
                            >
                                <span className="material-symbols-outlined">
                                    edit
                                </span>
                            
                            </button>

                            <button
                                onClick={() => eliminarProyecto(p.idProyecto)}
                                className="p-2 rounded-full text-red-700 hover:bg-red-100 transition"
                                title="Eliminar"
                                >
                                <span className="material-symbols-outlined">
                                    delete
                                </span>
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>
        </div>
        </div>
    );
    }
