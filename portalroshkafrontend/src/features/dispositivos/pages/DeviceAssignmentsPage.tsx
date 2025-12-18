import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useAuth } from '../../../app/providers/AuthContext'
import { useDispositivosAsignados } from '../hooks/useDispositivosAsignados'
import { Roles } from '../../../types/roles'
import { dispositivosAsignadosColumns } from '../components/dispositivosAsignadosTableConfig'
import type { DispositivoAsignadoItem } from '../../../types'
import PageLayout from '../../../layouts/PageLayout'
import DataTable from '../../../shared/ui/components/DataTable'
import IconButton from '../../../shared/ui/components/IconButton'
import PaginationFooter from '../../../shared/ui/components/PaginationFooter'
import { tieneRol } from '../../../shared/utils/permisos'

interface Props {
  embedded?: boolean
}

export default function DeviceAssignmentsPage({ embedded = false }: Props) {
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [page, setPage] = useState(0)

  const puedeVerAsignaciones = tieneRol(user, Roles.ADMINISTRADOR_DEL_SISTEMA, Roles.OPERACIONES)

  // Hook especializado con paginación real
  const {
    data: asignaciones,
    totalPages,
    loading,
    error,
  } = useDispositivosAsignados(token, page, 10)

  const renderActions = (d: DispositivoAsignadoItem) => {
    if (tieneRol(user, Roles.OPERACIONES)) {
      return (
        <button
          onClick={() =>
            navigate(`/dispositivos-asignados/${d.idDispositivoAsignado}?readonly=true`)
          }
          className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 transition"
        >
          Ver
        </button>
      )
    }
    return (
      <button
        onClick={() => navigate(`/dispositivos-asignados/${d.idDispositivoAsignado}`)}
        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition"
      >
        Editar
      </button>
    )
  }

  if (!puedeVerAsignaciones) return <p>No tenés permisos para ver esta página.</p>
  if (loading) return <p>Cargando asignaciones...</p>
  if (error) return <p>{error}</p>

  const body = (
    <>
      <DataTable
        data={asignaciones}
        columns={dispositivosAsignadosColumns}
        rowKey={(d) => d.idDispositivoAsignado}
        actions={renderActions}
        scrollable={false}
      />

      <PaginationFooter currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )

  if (embedded) {
    return (
      <div>
        <div className="mb-3 flex justify-end">
          <IconButton
            label="Asignar Dispositivo"
            icon={<span className="material-symbols-outlined">add</span>}
            variant="primary"
            onClick={() => navigate('/dispositivos-asignados/nuevo')}
            className="h-10 text-sm px-4 flex items-center"
          />
        </div>
        {body}
      </div>
    )
  }

  // Modo página completa
  return (
    <PageLayout
      title="Gestión de Dispositivos Asignados"
      actions={
        <IconButton
          label="Asignar Dispositivo"
          icon={<span className="material-symbols-outlined">add</span>}
          variant="primary"
          onClick={() => navigate('/dispositivos-asignados/nuevo')}
          className="h-10 text-sm px-4 flex items-center"
        />
      }
    >
      {body}
    </PageLayout>
  )
}
