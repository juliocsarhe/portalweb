import React from "react";
import DataTable from "./DataTable";
import { ProfileHistoryItem } from "@/features/asignacion-equipo/types/ProfileHistory.types";

type Props = {
    data: ProfileHistoryItem[]
}

export default function ProfileHistory({ data }: Props) {

    const columns = [{

        key: 'proyecto',
        label: 'Proyecto',
        render: (row: ProfileHistoryItem) => row.proyecto.nombre,
    }, {

        key: 'tareasRealizadas',
        label: 'Tarea/Actividad',

    }, {
        key: 'equipo',
        label: 'Equipo',
        render: (row: ProfileHistoryItem) => row.equipo.nombre
    }, {
        key: 'fechaInicio',
        label: 'Inicio',
        render: (row: ProfileHistoryItem) => new Date(row.fechaInicio).toLocaleDateString(),
    }, {
        key: 'fechaFin',
        label: 'Fin',
        render: (row: ProfileHistoryItem) => row.fechaFin ? new Date(row.fechaFin).toLocaleDateString() : 'En curso',
    },
    ]

    return (

        <div className="mt-8 rounded-2xl border border-white/40 dark:border-gray-700 bg-white/50
    dark:bg-gray-800/70 backdrop-blur-xs shadow-xs">

            <div className="px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Historial del Usuario
                </h2>
            </div>

            <DataTable

                data={data}
                columns={columns}
                rowKey={(row) => row.id}
                enableSearch
                scrollable={false}
            />

        </div>

    )
}