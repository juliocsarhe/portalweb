/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Use another form library or improve DynamicForm to avoid using 'any' here.
import { useNavigate, useParams, useLocation } from 'react-router'

import { useAuth } from '../../../app/providers/AuthContext'
import { useCatalogosUsuarios } from '../hooks/useCatalogosUsuarios'
import { useUsuarioForm } from '../hooks/useUsuarioForm'
import FormLayout from '../../../layouts/FormLayout'
import { buildUsuarioSections } from '../components/usuarioFormFields'
import { EstadoActivoInactivo } from '../../../types/index'
import DynamicForm from '../../../shared/ui/components/DynamicForm'

export default function UserFormPage() {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const cedulaParamStr = new URLSearchParams(location.search).get('cedula')
  const cedulaParam = cedulaParamStr ? Number(cedulaParamStr) : undefined

  // Catálogos (roles y cargos)
  const { roles, cargos, loading: loadingCatalogos } = useCatalogosUsuarios(token)

  // Hook de formulario de usuario
  const {
    data,
    setData,
    loading: loadingUsuario,
    error,
    handleSubmit,
    isEditing,
  } = useUsuarioForm(token, id, cedulaParam)

  // Loading combinado
  const loading = loadingCatalogos || loadingUsuario

  // Configuración de secciones (roles y cargos actuales)
  const sections = buildUsuarioSections(roles, cargos)

  // Render
  const readonly = new URLSearchParams(location.search).get('readonly') === 'true'

  /**
   * Normaliza datos para que coincidan con los DTOs esperados en el backend
   * - Insert (POST) → UserInsertDto → rol + cargo
   * - Update (PUT) → UserUpdateDto → roles + cargos
   */
  const normalizeData = (formData: Record<string, any>) => {
    const base = {
      ...formData,
      nroCedula: formData.nroCedula ?? '',
      estado: formData.estado ?? EstadoActivoInactivo.A,
      fechaIngreso: formData.fechaIngreso || null,
      fechaNacimiento: formData.fechaNacimiento || null,
      requiereCambioContrasena: formData.requiereCambioContrasena ?? true,
      urlPerfil: formData.urlPerfil || null,
      disponibilidad: formData.disponibilidad ?? 0,
    }

    if (isEditing) {
      // Para UPDATE (UserUpdateDto → roles, cargos)
      return {
        ...base,
        roles: { idRol: Number(formData.idRol) },
        cargos: { idCargo: Number(formData.idCargo) },
      }
    } else {
      // Para INSERT (UserInsertDto → rol, cargo)
      return {
        ...base,
        rol: { idRol: Number(formData.idRol) },
        cargo: { idCargo: Number(formData.idCargo) },
      }
    }
  }

  return (
    <FormLayout
      title={isEditing ? (readonly ? 'Detalle usuario' : 'Editar usuario') : 'Crear usuario'}
      subtitle={
        readonly
          ? 'Vista de solo lectura'
          : isEditing
            ? 'Modifica los campos necesarios'
            : 'Completá la información del nuevo usuario'
      }
      icon={isEditing ? (readonly ? <span className="material-symbols-outlined">
visibility
</span> : <span className="material-symbols-outlined">
edit
</span>) : <span className="material-symbols-outlined text-black dark:text-white">
deployed_code_account
</span>}
      onCancel={() => navigate('/usuarios')}
      onSubmitLabel={readonly ? undefined : isEditing ? 'Guardar cambios' : 'Crear usuario'}
      onCancelLabel={readonly ? 'Volver' : 'Cancelar'}
    >
      <DynamicForm
        id="dynamic-form"
        sections={sections}
        initialData={data}
        onChange={setData}
        onSubmit={async (formData) => {
          if (!readonly) {
            const normalized = normalizeData(formData)
            const ok = await handleSubmit(normalized)
            if (ok) {
              navigate(`/usuarios?success=${isEditing ? 'updated' : 'created'}`)
            }
          }
        }}
        loading={loading}
        readonly={readonly}
        className="flex-1 overflow-hidden"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </FormLayout>
  )
}
