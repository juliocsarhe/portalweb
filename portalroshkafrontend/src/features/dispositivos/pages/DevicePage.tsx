import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { useAuth } from '../../../app/providers/AuthContext'
import { Roles } from '../../../types/roles'
import type { DispositivoItem } from '../../../types'
import { useDispositivos } from '../hooks/useDispositivos'
import PageLayout from '../../../layouts/PageLayout'
import { dispositivosColumns } from '../components/dispositivoTableConfig'
import {
  CategoriaEnum,
  CategoriaLabels,
  EstadoInventarioEnum,
  EstadoInventarioLabels,
} from '../../../types'
import IconButton from '../../../shared/ui/components/IconButton'
import { MsIcon } from '../../../shared/ui/components/MsIcon'
import PaginationFooter from '../../../shared/ui/components/PaginationFooter'
import SelectDropdown from '../../../shared/ui/components/SelectDropdown'
import { tieneRol } from '../../../shared/utils/permisos'
import DataTable, { RowAction } from '../../../shared/ui/components/DataTable'

export default function DevicePage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()

  // 🔒 permisos
  const puedeVer = tieneRol(user, Roles.ADMINISTRADOR_DEL_SISTEMA, Roles.OPERACIONES)
  const puedeEditar = tieneRol(user, Roles.ADMINISTRADOR_DEL_SISTEMA)

  // Filtros
  const [categoria, setCategoria] = useState('')
  const [estado, setEstado] = useState('')
  const [encargado, setEncargado] = useState('')
  const [page, setPage] = useState(0)

  // Resetear página cuando cambian filtros
  useEffect(() => {
    setPage(0)
  }, [categoria, estado, encargado])

  // Hook de listado
  const {
    data: dispositivos,
    loading,
    error,
    totalPages,
  } = useDispositivos(token, { categoria, estado, encargado }, page, 10)

  const limpiarFiltros = () => {
    setCategoria('')
    setEstado('')
    setEncargado('')
    setPage(0)
  }

  const columns = dispositivosColumns

  //  Acciones por fila
  const rowActions: RowAction<DispositivoItem>[] = useMemo(() => {
    if (!puedeEditar) {
      return [
        {
          key: 'view',
          label: 'Ver',
          icon: <MsIcon name="visibility" />,
          onClick: (d) => navigate(`/dispositivos/${d.idDispositivo}?readonly=true`),
          variant: 'secondary',
        },
      ]
    }
    return [
      {
        key: 'edit',
        label: 'Editar',
        icon: <MsIcon name="edit" />,
        onClick: (d) => navigate(`/dispositivos/${d.idDispositivo}`),
        variant: 'primary',
      },
    ]
  }, [puedeEditar, navigate])

  //  acceso total
  if (!puedeVer) {
    return <p>No tenés permisos para ver esta página.</p>
  }

  return (
    <PageLayout
      title="Listado de dispositivos"
      actions={
        puedeEditar && (
          <IconButton
            label="Registrar Dispositivo"
            icon={<span>➕</span>}
            variant="primary"
            onClick={() => navigate('/dispositivos/nuevo')}
            className="h-10 text-sm px-4 flex items-center"
          />
        )
      }
    >
      <div className="flex items-end gap-4 mb-4">
        <SelectDropdown
          name="categoria"
          label="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          options={Object.values(CategoriaEnum).map((value) => ({
            value,
            label: CategoriaLabels[value],
          }))}
          placeholder="Filtrar por Categoría"
          noMargin
        />
        <SelectDropdown
          name="estado"
          label="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          options={Object.values(EstadoInventarioEnum).map((value) => ({
            value,
            label: EstadoInventarioLabels[value],
          }))}
          placeholder="Filtrar por Estado"
          noMargin
        />
        <IconButton
          label="Limpiar filtros"
          icon={<span>🧹</span>}
          variant="secondary"
          onClick={limpiarFiltros}
          className="h-10 text-sm px-4 flex items-center"
        />
      </div>

      {loading && <p>Cargando dispositivos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <DataTable<DispositivoItem>
        data={dispositivos}
        columns={columns}
        rowKey={(d) => d.idDispositivo}
        rowActions={rowActions}
        scrollable={false}
      />

      <PaginationFooter
        currentPage={page}
        totalPages={totalPages || 1}
        onPageChange={setPage}
        onCancel={() => navigate('/home')}
      />
    </PageLayout>
  )
}
