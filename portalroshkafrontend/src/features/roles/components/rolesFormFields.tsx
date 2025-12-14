import type { FormSection } from '../../../shared/ui/components/DynamicForm'

export function buildRolSections(): FormSection[] {
  return [
    {
      title: 'Datos del rol',
      icon: <span className="material-symbols-outlined">
cases
</span>,
      fields: [
        {
          name: 'nombre',
          label: 'Nombre del rol',
          type: 'text',
          required: true,
          placeholder: 'Ej: Administrador, Operaciones, TH',
        },
      ],
    },
  ]
}
