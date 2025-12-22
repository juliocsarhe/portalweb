    type Props = {
    open: boolean
    onClose: () => void
    proyecto: any
    loading?: boolean
    }

    export default function ProyectoDetalleModal({
    open,
    onClose,
    proyecto,
    loading,
    }: Props) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div
            className="
            w-full max-w-2xl rounded-2xl p-6 shadow-xl
            bg-white text-gray-800
            dark:bg-slate-900 dark:text-white
            "
        >
            
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Detalle del Proyecto
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

            {!loading && proyecto && (
            <div className="space-y-4 text-sm">
                <div>
                <span className="font-medium text-gray-500 dark:text-slate-400">
                    Nombre
                </span>
                <p>{proyecto.nombre}</p>
                </div>

                <div>
                <span className="font-medium text-gray-500 dark:text-slate-400">
                    Cliente
                </span>
                <p>{proyecto.nombreCliente ?? "-"}</p>
                </div>

                <div>
                <span className="font-medium text-gray-500 dark:text-slate-400">
                    Descripción
                </span>
                <p className="text-gray-700 dark:text-slate-300">
                    {proyecto.descripcion || "Sin descripción"}
                </p>
                </div>

                <div>
                <span className="font-medium text-gray-500 dark:text-slate-400">
                    Tecnologías
                </span>

                <div className="flex flex-wrap gap-2 mt-2">
                    {proyecto.tecnologias?.length ? (
                    proyecto.tecnologias.map((tech: any) => (
                        <span
                        key={tech.idTecnologia}
                        title={tech.descripcion}
                        className="
                            px-3 py-1 rounded-full text-xs
                            bg-blue-100 text-blue-700
                            dark:bg-blue-600/20 dark:text-blue-300
                        "
                        >
                        {tech.nombre}
                        </span>
                    ))
                    ) : (
                    <span className="text-gray-500 dark:text-slate-400">
                        No definidas
                    </span>
                    )}
                </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="font-medium text-gray-500 dark:text-slate-400">
                    Equipo
                    </span>
                    <p>{proyecto.nombreEquipo ?? "-"}</p>
                </div>

                <div>
                    <span className="font-medium text-gray-500 dark:text-slate-400">
                    Líder
                    </span>
                    <p>{proyecto.nombreLider ?? "-"}</p>
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
