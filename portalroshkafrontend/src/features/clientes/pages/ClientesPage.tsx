import { useState } from 'react'

import { useAuth } from '../../../app/providers/AuthContext'
import { Roles } from '../../../types/roles'
import PageLayout from '../../../layouts/PageLayout'
import { useClientesList } from '../hooks/useClientesList'
import { useClientesForm } from '../hooks/useClienteForm'
import type { ClienteResponse } from '../../../types'
import { clientesColumns } from '../components/clientesTableConfig'
import { Alert } from '../../../shared/ui/components/Alert'
import ConfirmModal from '../../../shared/ui/components/ConfirmModal'
import DataTable, { type RowAction } from '../../../shared/ui/components/DataTable'
import IconButton from '../../../shared/ui/components/IconButton'
import { MsIcon } from '../../../shared/ui/components/MsIcon'
import PaginationFooter from '../../../shared/ui/components/PaginationFooter'
import { tieneRol } from '../../../shared/utils/permisos'

import ClientesModal from './ClientesModal'

interface Props {
  embedded?: boolean
}

export default function ClientesPage({ embedded = false }: Props) {
  const { token, user } = useAuth()

  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<ClienteResponse | null>(null)
  const [showModal, setShowModal] = useState(false)

  // estados para confirmación
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<ClienteResponse | null>(null)

  // Reglas de permisos básicas
  const canEdit = tieneRol(user, Roles.OPERACIONES)

  // Listado paginado
  const { data, loading, error, refresh } = useClientesList(token, {
    page,
    size: 10,
    sortBy: 'default',
  })

  // Hook para eliminar
  const {
    remove,
    deleting,
    error: deleteError,
  } = useClientesForm(token, {
    onDeleted: () => refresh(),
  })

  const onEdit = (row: ClienteResponse) => {
    setSelected(row)
    setShowModal(true)
  }

  const askDelete = (row: ClienteResponse) => {
    setRowToDelete(row)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (rowToDelete) {
      await remove(rowToDelete.idCliente)
      setRowToDelete(null)
      setConfirmOpen(false)
    }
  }

  const rowActions: RowAction<ClienteResponse>[] = canEdit
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

  const newClienteButton = canEdit && (
    <IconButton
      label="Nuevo Cliente"
      icon={<span className="material-symbols-outlined">add</span>}
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

      <DataTable<ClienteResponse>
        data={data?.content ?? []}
        columns={clientesColumns}
        rowKey={(c) => c.idCliente}
        rowActions={rowActions}
        scrollable={false}
      />

      <PaginationFooter
        currentPage={page}
        totalPages={data?.totalPages ?? 0}
        onPageChange={setPage}
      />

      {/* Modal CRUD */}
      {showModal && (
        <ClientesModal
          token={token}
          id={selected?.idCliente}
          onClose={() => setShowModal(false)}
          onSaved={refresh}
        />
      )}

      {/* Modal de confirmación */}
      <ConfirmModal
        show={confirmOpen}
        title="Eliminar Cliente"
        message={`¿Estás seguro de eliminar el cliente "${rowToDelete?.nombre}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />

      {loading && <Alert kind="info">Cargando clientes…</Alert>}
      {error && <Alert kind="error">{error}</Alert>}
    </>
  )

  if (embedded) {
    return (
      <div>
        <div className="mb-3 flex justify-end">{newClienteButton}</div>
        {body}
      </div>
    )
  }

  return (
    <PageLayout title="Clientes" actions={newClienteButton}>
      {body}
    </PageLayout>
  )
}
