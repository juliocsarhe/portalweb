import { useMemo } from 'react'

import { buildTipoDispositivoSections } from '../components/tipoDispositivoFormFields'
import { useTipoDispositivoForm } from '../hooks/useTipoDispositivoForm'
import type { Alert } from '../../../shared/ui/components/Alert'
import BaseModal from '../../../shared/ui/components/BaseModal'
import DynamicModalForm from '../../../shared/ui/components/DynamicModalForm'

interface Props {
  token: string | null
  id?: number | string
  onClose: () => void
  onSaved?: () => void
  readonly?: boolean
}

export default function TipoDispositivoModal({
  token,
  id,
  onClose,
  onSaved,
  readonly = false,
}: Props) {
  const { data, setData, handleSubmit, loading, error, isEditing } = useTipoDispositivoForm(
    token,
    id
  )

  const sections = buildTipoDispositivoSections()

  // bloquear solo mientras no hay data y está cargando
  const hasData = useMemo(() => !!data && Object.keys(data).length > 0, [data])
  const formLoading = !readonly && loading && !hasData

  const title = isEditing
    ? readonly
      ? 'Detalle de tipo de dispositivo'
      : 'Editar tipo de dispositivo'
    : 'Nuevo tipo de dispositivo'

  // si tus fields requieren nombres exactos, podés mapear aquí:
  const initial = data ?? {}

  return (
    <BaseModal show onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>

      <DynamicModalForm
        id="tipo-dispositivo-form"
        key={isEditing ? `tipo-${data?.idTipoDispositivo ?? 'x'}` : 'tipo-new'}
        sections={sections}
        initialData={initial}
        readonly={readonly}
        loading={formLoading}
        onChange={setData}
        onSubmit={async (formData) => {
          if (readonly) return
          await handleSubmit(formData)
          onSaved?.()
          onClose()
        }}
      />

      {error && <Alert kind="error">{error}</Alert>}

      {/* Footer con Guardar / Cancelar (igual a Roles) */}
      <div className="flex justify-end gap-2 mt-4">
        {!readonly && (
          <button
            form="tipo-dispositivo-form"
            type="submit"
            disabled={formLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isEditing ? 'Guardar cambios' : 'Crear'}
          </button>
        )}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </BaseModal>
  )
}
