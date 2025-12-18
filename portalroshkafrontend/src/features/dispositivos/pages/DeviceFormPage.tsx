// src/pages/dispositivos/DeviceFormPage.tsx
import { useNavigate, useParams, useLocation } from 'react-router'
import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '../../../app/providers/AuthContext'
import FormLayout from '../../../layouts/FormLayout'
import { buildDispositivoSections } from '../components/dispositivoFormFields'
import { useDispositivoForm } from '../hooks/useDispositivoForm'
import { getDeviceTypesPaged } from '../services/DeviceService'
import { getUbicaciones } from '../../ubicaciones/services/UbicacionService'
import { EstadoInventarioEnum } from '../../../types'
import DynamicForm from '../../../shared/ui/components/DynamicForm'

export default function DeviceFormPage() {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const idParam = id ? parseInt(id, 10) : undefined

  const { data, setData, loading, error, handleSubmit, isEditing } = useDispositivoForm(
    token,
    idParam
  )

  const [loadingCatalogs, setLoadingCatalogs] = useState(false)
  const [tipoOptions, setTipoOptions] = useState<{ value: number; label: string }[]>([])
  const [ubicOptions, setUbicOptions] = useState<{ value: number; label: string }[]>([])
  const userOptions: { value: number; label: string }[] = []

  useEffect(() => {
    if (!token) return
    let cancelled = false

    const loadCatalogs = async () => {
      try {
        setLoadingCatalogs(true)

        const tiposPage = await getDeviceTypesPaged<any>(token, 0, 200)
        const tipos = Array.isArray((tiposPage as any)?.content)
          ? (tiposPage as any).content
          : Array.isArray(tiposPage)
            ? tiposPage
            : []
        const ubic = await getUbicaciones(token)
        const ubicList = Array.isArray((ubic as any)?.content)
          ? (ubic as any).content
          : Array.isArray(ubic)
            ? ubic
            : []

        if (cancelled) return

        setTipoOptions(
          tipos.map((t: any) => ({
            value: t.idTipoDispositivo ?? t.id ?? 0,
            label: t.nombre ?? `Tipo #${t.idTipoDispositivo ?? t.id}`,
          }))
        )

        setUbicOptions(
          ubicList.map((u: any) => ({
            value: u.idUbicacion ?? u.id ?? 0,
            label: u.nombre ?? `Ubicación #${u.idUbicacion ?? u.id}`,
          }))
        )
      } finally {
        if (!cancelled) setLoadingCatalogs(false)
      }
    }

    loadCatalogs()
    return () => {
      cancelled = true
    }
  }, [token])

  const sections = useMemo(
    () => buildDispositivoSections(tipoOptions, ubicOptions, userOptions),
    [tipoOptions, ubicOptions, userOptions]
  )

  const readonly = new URLSearchParams(location.search).get('readonly') === 'true'

  const hasData = data && Object.keys(data).length > 0
  const formLoading = !readonly && (loading || loadingCatalogs) && !hasData

  const normalizeData = (formData: Record<string, any>) => {
    return {
      ...formData,
      tipoDispositivo: formData.tipoDispositivo ? Number(formData.tipoDispositivo) : undefined,
      ubicacion: formData.ubicacion ? Number(formData.ubicacion) : undefined,
      encargado: formData.encargado ? Number(formData.encargado) : undefined,
      estado: formData.estado ?? EstadoInventarioEnum.D,
      categoria: formData.categoria ?? undefined,
      fechaFabricacion: formData.fechaFabricacion || null,
    }
  }

  return (
    <FormLayout
      title={
        isEditing ? (readonly ? 'Detalle dispositivo' : 'Editar dispositivo') : 'Crear dispositivo'
      }
      subtitle={
        readonly
          ? 'Vista de solo lectura'
          : isEditing
            ? 'Modificá los campos necesarios'
            : 'Completá la información del nuevo dispositivo'
      }
      icon={
        isEditing ? (
          readonly ? (
            <span className="material-symbols-outlined">visibility</span>
          ) : (
            <span className="material-symbols-outlined">edit</span>
          )
        ) : (
          <span className="material-symbols-outlined">desktop_windows</span>
        )
      }
      onCancel={() => navigate('/dispositivos')}
      onSubmitLabel={readonly ? undefined : isEditing ? 'Guardar cambios' : 'Crear dispositivo'}
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
              navigate(`/dispositivos?success=${isEditing ? 'updated' : 'created'}`)
            }
          }
        }}
        loading={loading || loadingCatalogs}
        readonly={readonly}
        className="flex-1 overflow-hidden"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </FormLayout>
  )
}
