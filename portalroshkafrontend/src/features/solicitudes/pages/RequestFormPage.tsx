import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router'

import { useAuth } from '../../../app/providers/AuthContext'
import FormLayout from '../../../layouts/FormLayout'
import { useCatalogosSolicitudes } from '../hooks/useCatalogosSolicitudes'
import { useRequestForm } from '../hooks/useRequestForm'
import DynamicForm, { type FormSection } from '../../../shared/ui/components/DynamicForm'
import BeneficiosModal from './BeneficiosModal'
import MasBeneficios from '../components/MasBeneficios'
import { Beneficio } from '@/types'

export default function RequestFormPage() {
  const [showBeneficiosModal, setShowBeneficiosModal] = useState(false)
  const [beneficioSeleccionado, setBeneficioSeleccionado] = useState<Beneficio | null>(null)

  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = useAuth()

  const getTipo = (): 'PERMISO' | 'BENEFICIO' | 'VACACIONES' => {
    if (location.pathname.includes('permiso')) return 'PERMISO'
    if (location.pathname.includes('beneficio')) return 'BENEFICIO'
    return 'VACACIONES'
  }

  const tipo = getTipo()

  const { tiposPermiso, tiposBeneficio, loading: loadingCatalogos } = useCatalogosSolicitudes(token)

  const {
    data,
    setData,
    handleSubmit,
    isEditing,
    loading: loadingForm,
    error,
    editable,
  } = useRequestForm(tipo, id)

  const [beneficioError, setBeneficioError] = useState<string | null>(null)

  const loading = loadingCatalogos || loadingForm

  // Auto-calcular días para permisos
  useEffect(() => {
    if (tipo === 'PERMISO' && data.idSubtipo != null) {
      const tipoPermiso = tiposPermiso.find((t) => t.idTipoPermiso === data.idSubtipo)

      if (tipoPermiso) {
        if (tipoPermiso.cantDias && tipoPermiso.cantDias > 0) {
          setData((prev) => ({
            ...prev,
            cantDias: tipoPermiso.cantDias,
          }))
        } else {
          console.log(' Permiso editable, dejo cantDias sin tocar:', data.cantDias)
          if (data.cantDias == null) {
            setData((prev) => ({
              ...prev,
              cantDias: 0,
            }))
          }
        }
      }
    }
  }, [data.idSubtipo, tipo, tiposPermiso])

  // Si es beneficio, asegurar monto en 0 por defecto
  useEffect(() => {
    if (tipo === 'BENEFICIO' && (data.monto == null || isNaN(Number(data.monto)))) {
      setData((prev) => ({ ...prev, monto: 0 }))
    }
  }, [tipo, data.monto, setData])

  // Validar monto contra monto máximo del beneficio
  useEffect(() => {
    if (tipo === 'BENEFICIO' && data.idSubtipo === 1) {
      const beneficio = tiposBeneficio.find((b) => b.idTipoBeneficio === data.idSubtipo)
      if (beneficio && data.monto != null) {
        if (data.monto > beneficio.montoMaximo) {
          setBeneficioError(
            `El monto ingresado (${data.monto}) excede el máximo permitido (${beneficio.montoMaximo}) para este beneficio.`
          )
        } else {
          setBeneficioError(null)
        }
      }
    } else {
      setBeneficioError(null)
    }
  }, [tipo, data.idSubtipo, data.monto, tiposBeneficio])

  const getSections = (): FormSection[] => {
    const fields: any[] = []

    if (tipo === 'PERMISO') {
      fields.push({
        name: 'idSubtipo',
        label: 'Tipo de permiso',
        type: 'select',
        required: true,
        options: tiposPermiso.map((t) => ({ value: t.idTipoPermiso, label: t.nombre })),
        value: data.idSubtipo,
        disabled: !editable,
      })
    }

    if (tipo === 'BENEFICIO') {
      fields.push({
        name: 'monto',
        label: 'Monto',
        type: 'number',
        required: true,
        value: data.monto ?? 0,
        disabled: !editable,
        error: beneficioError || undefined,
      })
    }

    // Campos para todas las solicitudes
    fields.push({
      name: 'fechaInicio',
      label: 'Fecha de inicio',
      type: 'date',
      required: true,
      value: data.fechaInicio,
      disabled: !editable,
    })

    // Solo VACACIONES tiene fechaFin
    if (tipo === 'VACACIONES') {
      fields.push({
        name: 'fechaFin',
        label: 'Fecha de fin',
        type: 'date',
        required: true,
        value: data.fechaFin,
        disabled: !editable,
      })
    }

    // Campos solo para PERMISO
    if (tipo === 'PERMISO') {
      const tipoPermiso = tiposPermiso.find((t) => t.idTipoPermiso === data.idSubtipo)
      const diasFijos = tipoPermiso?.cantDias && tipoPermiso.cantDias > 0

      fields.push({
        name: 'cantDias',
        label: 'Cantidad de días',
        type: 'number',
        required: true,
        value: data.cantDias ?? 0,
        disabled: !editable || diasFijos,
      })
    }

    // Comentario solo para PERMISO y BENEFICIO
    if (tipo !== 'VACACIONES') {
      fields.push({
        name: 'comentario',
        label: 'Comentario',
        type: 'text',
        required: tipo === 'BENEFICIO',
        value: data.comentario,
        disabled: !editable,
      })
    }

    const iconMap = {
      PERMISO: (
        <span className="material-symbols-outlined text-gray-800 dark:text-gray-100">
          content_paste
        </span>
      ),
      BENEFICIO: (
        <span className="material-symbols-outlined text-gray-800 dark:text-gray-100">
          local_florist
        </span>
      ),
      VACACIONES: (
        <span className="material-symbols-outlined text-gray-800 dark:text-gray-100">
          chair_umbrella
        </span>
      ),
    }

    return [
      {
        title: `Información de ${tipo === 'PERMISO' ? 'Permiso' : tipo === 'BENEFICIO' ? 'Beneficio' : 'Vacaciones'}`,
        icon: iconMap[tipo],
        fields,
      },
    ]
  }

  if (loading) return <p>Cargando...</p>

  const titleMap = {
    PERMISO: 'Permiso',
    BENEFICIO: 'Beneficio',
    VACACIONES: 'Vacaciones',
  }

  const handleFormSubmit = async () => {
    if (beneficioError) return

    // Validar fecha de inicio
    if (data.fechaInicio) {
      const fechaInicio = new Date(data.fechaInicio)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)

      if (fechaInicio < hoy) {
        alert('La fecha de inicio no puede ser anterior a hoy')
        return
      }
    }

    // Limpiar campos que no correspondan al tipo
    const formData = { ...data }
    if (tipo !== 'VACACIONES') {
      delete formData.fechaFin
    }

    const success = await handleSubmit(formData)
    if (success) {
      navigate(-1)
    }
  }

  return (
    <>
      <FormLayout
        title={`${isEditing ? 'Editar' : 'Nueva'} Solicitud de ${titleMap[tipo]}`}
        subtitle={`Completa la información de tu solicitud de ${titleMap[tipo].toLowerCase()}`}
        icon={
          tipo === 'PERMISO' ? (
            <span className="material-symbols-outlined text-gray-800 dark:text-gray-100">
              content_paste
            </span>
          ) : tipo === 'BENEFICIO' ? (
            <span className="material-symbols-outlined text-gray-800 dark:text-gray-100">
              hand_package
            </span>
          ) : (
            <span className="material-symbols-outlined text-gray-800 dark:text-gray-100">
              chair_umbrella
            </span>
          )
        }
        onCancel={() => navigate(-1)}
        onSubmitLabel={isEditing ? 'Guardar cambios' : 'Enviar solicitud'}
      >
        {/* Selector de beneficio con dropdown */}
        {tipo === 'BENEFICIO' && editable && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Tipo de beneficio *
            </label>

            <button
              type="button"
              onClick={() => setShowBeneficiosModal(true)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-left hover:border-[#3949AB] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                {beneficioSeleccionado ? (
                  <>
                    <img
                      src={beneficioSeleccionado.imagen}
                      alt={beneficioSeleccionado.nombre}
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {beneficioSeleccionado.nombre}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {beneficioSeleccionado.descripcion}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-gray-400">card_giftcard</span>
                    <p className="text-gray-500 dark:text-gray-400">Selecciona un beneficio...</p>
                  </>
                )}
              </div>

              <span className="material-symbols-outlined text-gray-400 transition-transform group-hover:text-[#3949AB]">
                expand_more
              </span>
            </button>
          </div>
        )}

        <DynamicForm
          id="dynamic-form"
          sections={getSections()}
          initialData={data}
          onChange={(newData) => setData((prev) => ({ ...prev, ...newData }))}
          onSubmit={handleFormSubmit}
          loading={loading}
        />
        {beneficioError && <p className="text-red-500 text-sm mt-2">{beneficioError}</p>}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Componente de más beneficios */}
        {tipo === 'BENEFICIO' && <MasBeneficios />}
      </FormLayout>

      {/* Modal de beneficios */}
      <BeneficiosModal
        show={showBeneficiosModal}
        onClose={() => setShowBeneficiosModal(false)}
        onSelect={(beneficio) => {
          setBeneficioSeleccionado(beneficio)
          setData((prev) => ({ ...prev, idSubtipo: beneficio.id }))
        }}
        selectedId={beneficioSeleccionado?.id}
      />
    </>
  )
}
