import type { FormSection } from '../../../shared/ui/components/DynamicForm'

export function buildSolicitudDispositivoSections(
  tiposDispositivo: { value: number; label: string }[] = []
): FormSection[] {
  return [
    {
      title: 'Datos de la solicitud',
      icon: '📝',
      fields: [
        {
          name: 'idTipoDispositivo',
          label: 'Tipo de dispositivo',
          type: 'select',
          required: true,
          options: tiposDispositivo,
        },
        {
          name: 'comentario',
          label: 'Comentario',
          type: 'text',
        },
      ],
    },
  ]
}