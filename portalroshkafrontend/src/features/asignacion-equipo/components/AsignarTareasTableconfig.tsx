import { ReactNode } from "react";
import { UsuarioEquipoProyectoItem } from "@/types/UsuarioEquipoProyecto.types";
import { u } from "react-router/dist/development/index-react-server-client-CCjKYJTH";

export interface TableColumn<T>{
    key: string 
    label: string
    render?:(row:T)=> ReactNode
    className?: string
}

export const asignarTareasColumns: TableColumn<UsuarioEquipoProyectoItem>[]=[

{
    key:'nombreCompleto',
    label:'Usuario',
    render: (u)=> u.nombreCompleto ?? `${u.nombre} ${u.apellido}`,

},
{
    key:'nombreEquipo',
    label:'Equipo',
},
{
    key:'nombreProyecto',
    label:'Proyecto',
},
]