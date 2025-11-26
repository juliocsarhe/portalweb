import { useMemo, useState } from 'react'

import { useAuth } from '../../../app/providers/AuthContext'
import { Roles } from '../../../types/roles'
import PageLayout from '../../../layouts/PageLayout'
import { useCargosList } from '../hooks/useCargosList'
import { useCargoForm } from '..//hooks/useCargoForm'
import CargosModal from '../components/CargosModal'
import type { CargoListItem } from '../../../types'
import { cargosColumns } from '../components/cargosTableConfig'
import { Alert } from '../../../shared/ui/components/Alert'
import ConfirmModal from '../../../shared/ui/components/ConfirmModal'
import DataTable, { type RowAction } from '../../../shared/ui/components/DataTable'
import IconButton from '../../../shared/ui/components/IconButton'
import { MsIcon } from '../../../shared/ui/components/MsIcon'
import PaginationFooter from '../../../shared/ui/components/PaginationFooter'
import { tieneRol } from '../../../shared/utils/permisos'

interface Props {
  embedded?: boolean
}

export default function CargosPage({ embedded = false }: Props) {
  const { token, user } = useAuth()

  // permisos básicos
  const canEdit = !tieneRol(user, Roles.OPERACIONES)

  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<CargoListItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  // 👇 estados para confirmación
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<CargoListItem | null>(null)

  const params = useMemo(() => ({ page, size: 10 }), [page])
  const { data, loading, error, refresh } = useCargosList(token, params)

  // Hook para delete
  const {
    remove,
    deleting,
    error: deleteError,
    success: deleteSuccess,
    clearMessages,
  } = useCargoForm(token, {
    onDeleted: () => refresh(),
  })

  const onEdit = (row: CargoListItem) => {
    setSelected(row)
    setShowModal(true)
  }

  // 👇 ahora abrimos el modal en vez del confirm del navegador
  const askDelete = (row: CargoListItem) => {
    setRowToDelete(row)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (rowToDelete) {
      await remove(rowToDelete.idCargo)
      setRowToDelete(null)
      setConfirmOpen(false)
    }
  }

  const rowActions: RowAction<CargoListItem>[] = canEdit
    ? [
        {
          key: 'edit',
          label: 'Editar',
          icon: <MsIcon name="edit" />,
          onClick: onEdit,
          variant: 'primary',
        },
        {
          key: 'delete',
          label: 'Eliminar',
          icon: <MsIcon name="delete" />,
          onClick: askDelete, // 👈 reemplazado
          variant: 'danger',
          disabled: deleting,
        },
      ]
    : []

  const newCargoButton = canEdit && (
    <IconButton
      label="Nuevo Cargo"
      icon={<span>➕</span>}
      variant="primary"
      onClick={() => {
        setSelected(null)
        setShowModal(true)
      }}
      className="h-10 text-sm px-4 flex items-center"
    />
  )

  const body = (
    <>
      {/* feedback de delete */}
      {deleteError && <Alert kind="error">{deleteError}</Alert>}
      {deleteSuccess && <Alert kind="success">{deleteSuccess}</Alert>}

      <DataTable<CargoListItem>
        data={data?.content ?? []}
        columns={cargosColumns}
        rowKey={(c) => c.idCargo}
        rowActions={rowActions}
        scrollable={false}
      />

      <PaginationFooter
        currentPage={page}
        totalPages={data?.totalPages ?? 0}
        onPageChange={(p) => {
          clearMessages()
          setPage(p)
        }}
      />

      {/* Modal CRUD */}
      {showModal && (
        <CargosModal
          token={token}
          id={selected?.idCargo}
          onClose={() => setShowModal(false)}
          onSaved={refresh}
        />
      )}

      {/* 👇 nuevo modal de confirmación */}
      <ConfirmModal
        show={confirmOpen}
        title="Eliminar Cargo"
        message={`¿Estás seguro de eliminar el cargo "${rowToDelete?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />

      {loading && <Alert kind="info">Cargando cargos…</Alert>}
      {error && <Alert kind="error">{error}</Alert>}
    </>
  )

  if (embedded) {
    return (
      <div>
        <div className="mb-3 flex justify-end">{newCargoButton}</div>
        {body}
      </div>
    )
  }

  return (
    <PageLayout title="Cargos" actions={newCargoButton}>
      {body}
    </PageLayout>
  )
}
