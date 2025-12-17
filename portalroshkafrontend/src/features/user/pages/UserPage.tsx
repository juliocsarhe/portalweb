/* eslint-disable react-hooks/rules-of-hooks */
// TODO: Rules of hooks está deshabilitado porque los hooks se usan condicionalmente según permisos.
//       Hay mejores formas de hacer esto, pero por ahora lo dejamos así para avanzar rápido.
//       En el futuro, refactorizar para usar rutas protegidas o componentes separados.
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'

import { useAuth } from '../../../app/providers/AuthContext'
import { useUsuarios } from '../hooks/useUsuarios'
import { useCatalogosUsuarios } from '../hooks/useCatalogosUsuarios'
import { Roles } from '../../../types/roles'
import { EstadoLabels } from '../../../types'
import type { UsuarioItem } from '../../../types'
import PageLayout from '../../../layouts/PageLayout'
import { usuariosColumns } from '../components/usuariosTableConfig'
import DataTable, { type RowAction } from '../../../shared/ui/components/DataTable'
import IconButton from '../../../shared/ui/components/IconButton'
import { MsIcon } from '../../../shared/ui/components/MsIcon'
import PaginationFooter from '../../../shared/ui/components/PaginationFooter'
import SelectDropdown from '../../../shared/ui/components/SelectDropdown'
import Toast from '../../../shared/ui/components/Toast'
import { tieneRol } from '../../../shared/utils/permisos'
import UsuarioHistorialModal from './UsuarioHistorialModal'

export default function UserPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [filtros, setFiltros] = useState<{ idRol?: number; idCargo?: number; estado?: 'A' | 'I' }>(
    {}
  )
  const [page, setPage] = useState(0)

  // Toast con tipo
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('info')

  if (!token) return <p>No autorizado</p>

  // permisos

  const puedeVerUsuarios = tieneRol(user, Roles.TALENTO_HUMANO)
  const puedeEditarUsuarios = tieneRol(user, Roles.TALENTO_HUMANO)

  // si no tiene permisos de ver
  if (!puedeVerUsuarios) {
    return <p>No tenés permisos para ver esta página.</p>
  }

  // Catálogos
  const { roles, cargos, loading: loadingCatalogos } = useCatalogosUsuarios(token)

  // Usuarios
  const {
    data: usuarios,
    totalPages,
    loading: loadingUsuarios,
    error,
  } = useUsuarios(token, filtros, page, 10)

  const limpiarFiltros = () => {
    setFiltros({})
    setPage(0)
  }

  const [openHistorial, setOpenHistorial] = useState(false)
  const [usuarioHistorialId, setUsuarioHistorialId] = useState<number | null>(null)

  // Acciones con íconos
  const onEdit = (u: UsuarioItem) => navigate(`/usuarios/${u.idUsuario}`)
  const onView = (u: UsuarioItem) => navigate(`/usuarios/${u.idUsuario}?readonly=true`)

  const rowActions: RowAction<UsuarioItem>[] = puedeEditarUsuarios
    ? [
        {
          key:'historial',
          label:'Historial',
          icon: <MsIcon name='visibility'/>,
          onClick: (u)=> {
            setUsuarioHistorialId(u.idUsuario)
            setOpenHistorial(true)
          },
          variant:'secondary',
        },

        {
          key: 'edit',
          label: 'Editar',
          icon: <MsIcon name="edit" />,
          onClick: onEdit,
          variant: 'primary',
        },
      ]
    : [
        {
          key: 'view',
          label: 'Ver',
          icon: <MsIcon name="visibility" />,
          onClick: onView,
          variant: 'secondary',
        },
      ]

  // Mostrar toast en base a query param success
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const success = params.get('success')

    if (success === 'created') {
      setToastMessage('✅ Usuario creado con éxito')
      setToastType('success')
    } else if (success === 'updated') {
      setToastMessage('✅ Usuario actualizado con éxito')
      setToastType('success')
    }
  }, [location.search])

  if (loadingUsuarios || loadingCatalogos) return <p>Cargando usuarios...</p>
  if (error) {
    return (
      <>
        <p>{error}</p>
        <Toast message="❌ Error al cargar usuarios" type="error" onClose={() => {}} />
      </>
    )
  }

  return (
    <>
    <PageLayout
      title="Listado de usuarios"
      actions={
        puedeEditarUsuarios && (
          <IconButton
            label="Crear Usuario"
            icon={<span>➕</span>}
            variant="primary"
            onClick={() => navigate('/usuarios/buscar')}
            className="h-10 text-sm px-4 flex items-center"
          />
        )
      }
    >
      {/*  Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <SelectDropdown
          label="Rol"
          name="idRol"
          value={filtros.idRol ?? ''}
          onChange={(e) =>
            setFiltros((prev) => ({
              ...prev,
              idRol: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          options={roles.map((r) => ({ value: r.idRol, label: r.nombre }))}
          placeholder="Todos"
          noMargin
        />

        <SelectDropdown
          label="Cargo"
          name="idCargo"
          value={filtros.idCargo ?? ''}
          onChange={(e) =>
            setFiltros((prev) => ({
              ...prev,
              idCargo: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
          options={cargos.map((c) => ({ value: c.idCargo, label: c.nombre }))}
          placeholder="Todos"
          noMargin
        />

        <SelectDropdown
          label="Estado"
          name="estado"
          value={filtros.estado ?? ''}
          onChange={(e) =>
            setFiltros((prev) => ({
              ...prev,
              estado: e.target.value as 'A' | 'I' | undefined,
            }))
          }
          options={Object.entries(EstadoLabels).map(([value, label]) => ({
            value,
            label,
          }))}
          placeholder="Todos"
          noMargin
        />

        <div className="h-full flex items-end">
          <IconButton
            label="Limpiar filtros"
            icon={<span>🧹</span>}
            variant="secondary"
            onClick={limpiarFiltros}
            className="h-10 text-sm px-4 flex items-center"
          />
        </div>
      </div>

      {/* Tabla */}
      <DataTable<UsuarioItem>
        data={usuarios}
        columns={usuariosColumns}
        rowKey={(u) => u.idUsuario}
        rowActions={rowActions}
        scrollable={false}
      />

      {/* Paginación */}
      <PaginationFooter currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Toast flotante */}
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
    </PageLayout>
    <UsuarioHistorialModal 
    open={openHistorial}
    usuarioId={usuarioHistorialId}
    onClose={()=>{
      setOpenHistorial(false)
      setUsuarioHistorialId(null)
    }}
    />
    </>
  )
}
