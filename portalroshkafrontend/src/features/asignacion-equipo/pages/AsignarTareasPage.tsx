import { useState } from 'react'
import PageLayout from '@/layouts/PageLayout'
import DataTable, { type RowAction } from '@/shared/ui/components/DataTable'
import { MsIcon } from '@/shared/ui/components/MsIcon'
import Toast from '@/shared/ui/components/Toast'

import { useAuth } from '@/app/providers/AuthContext'
import { Roles } from '@/types/roles'
import { tieneRol } from '@/shared/utils/permisos'

import { useAsignarTareas } from '../hook/useAsignarTareas'
import AsignarTareasFilters from '../components/AsignarTareasFilter'
import { asignarTareasColumns } from '../components/AsignarTareasTableconfig'
import { UsuarioEquipoProyectoItem } from '@/types/UsuarioEquipoProyecto.types'
import AsignarTareasModal from '../components/AsignarTareasModal'

export default function AsignarTareasPage(){

    const {token, user} = useAuth()

    const puedeVer = tieneRol(user, Roles.TEAM_LEADER)

    if(!token)return <p>No estas autorizado.</p>
    if(!puedeVer)return <p>No tienes permisos para ver esta pagina.</p>

    const {
        data, loading, error, search, setSearch, setIdEquipo, setIdProyecto, equipos, proyectos, refresh,
    } = useAsignarTareas(token)

    const[selected, setSelected] = useState<UsuarioEquipoProyectoItem|null>(null)


    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [toastType, setToastType] = useState<'success'|'error'|'info'|'warning'>('info')


    const limpiarFiltros = () => {
        setSearch('')
        setIdEquipo(undefined)
        setIdProyecto(undefined)
    }

    const rowActions: RowAction<UsuarioEquipoProyectoItem>[]=[
        {
            key:'asignar',
            label:'Asignar',
            icon:<MsIcon name='assignment' />,
            onClick:(row) => setSelected(row),
            variant: 'primary',
        },
    ]

    if(loading) return <p>Cargando datos...</p>

    if(error){
        return(
            <>
                <p>{error}</p>
                <Toast 
                message="Error al cargar los datos"
                type="error"
                onClose={()=> setToastMessage(null)}
                />
            </>
        )
    }


    return (
        <>
        
            <PageLayout title="Asignar tareas">

        <AsignarTareasFilters
          equipos={equipos}
          proyectos={proyectos}
          setIdEquipo={setIdEquipo}
          setIdProyecto={setIdProyecto}
          setSearch={setSearch}
          onClear={limpiarFiltros}
        />
        
        <DataTable<UsuarioEquipoProyectoItem>
          data={data}
          columns={asignarTareasColumns}
          rowKey={(u) => `${u.idUsuario}-${u.idProyecto}`}
          rowActions={rowActions}
          scrollable={false}
        />
        {toastMessage && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage(null)}
          />
        )}
      </PageLayout>

      {selected && (
        <AsignarTareasModal
          open={true}
          data={selected}
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setToastMessage('Tarea asignada correctamente')
            setToastType('success')
            setSelected(null)
            refresh()
          }}
        />
      )}
        
        </>
    )

}

