import { useMemo, useState } from 'react'

import { useAuth } from '../../../app/providers/AuthContext'
import { Roles as RolesEnum } from '../../../types/roles'
import PageLayout from '../../../layouts/PageLayout'
import { useRolesList } from '../hooks/useRolesList'
import { useRolForm } from '../hooks/useRolForm'
import RolesModal from '../components/RolesModal'
import type { RolListItem } from '../../../types'
import { rolesColumns } from '../components/rolesTableConfig'
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

export default function RolesPage({ embedded = false }: Props) {
  const { token, user } = useAuth()

  const canEdit = !tieneRol(user, RolesEnum.OPERACIONES)

  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<RolListItem | null>(null)
  const [showModal, setShowModal] = useState(false)

  // estados para confirmación
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<RolListItem | null>(null)

  const params = useMemo(() => ({ page, size: 10 }), [page])
  const { data, loading, error, refresh } = useRolesList(token, params)

  const {
    remove,
    deleting,
    error: deleteError,
    success: deleteSuccess,
    clearMessages,
  } = useRolForm(token, { onDeleted: () => refresh() })

  const onEdit = (row: RolListItem) => {
    setSelected(row)
    setShowModal(true)
  }

  // en vez de window.confirm abrimos modal
  const askDelete = (row: RolListItem) => {
    setRowToDelete(row)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (rowToDelete) {
      await remove(rowToDelete.idRol)
      setRowToDelete(null)
      setConfirmOpen(false)
    }
  }

  const rowActions: RowAction<RolListItem>[] = canEdit
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
          onClick: askDelete,
          variant: 'danger',
          disabled: deleting,
        },
      ]
    : []

  const newRolButton = canEdit && (
    <IconButton
      label="Nuevo Rol"
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
      {deleteError && <Alert kind="error">{deleteError}</Alert>}
      {deleteSuccess && <Alert kind="success">{deleteSuccess}</Alert>}

      <DataTable<RolListItem>
        data={data?.content ?? []}
        columns={rolesColumns}
        rowKey={(r) => r.idRol}
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

      {showModal && (
        <RolesModal
          token={token}
          id={selected?.idRol}
          onClose={() => setShowModal(false)}
          onSaved={refresh}
        />
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        show={confirmOpen}
        title="Eliminar Rol"
        message={`¿Estás seguro de eliminar el rol "${rowToDelete?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />

      {loading && <Alert kind="info">Cargando roles…</Alert>}
      {error && <Alert kind="error">{error}</Alert>}
    </>
  )

  if (embedded) {
    return (
      <div>
        <div className="mb-3 flex justify-end">{newRolButton}</div>
        {body}
      </div>
    )
  }

  return (
    <PageLayout title="Roles" actions={newRolButton}>
      {body}
    </PageLayout>
  )
}
