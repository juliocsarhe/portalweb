import type { FormSection } from '../../../shared/ui/components/DynamicForm'

export function buildCargoSections(): FormSection[] {
  return [
    {
      title: 'Datos del cargo',
      icon: '🛠️',
      fields: [
        {
          name: 'nombre',
          label: 'Nombre del cargo',
          type: 'text',
          required: true,
          placeholder: 'Ej: Desarrollador Frontend',
        },
      ],
    },
  ]
}
