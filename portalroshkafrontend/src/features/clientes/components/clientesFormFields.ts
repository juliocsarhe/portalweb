import type { FormSection } from '../../../shared/ui/components/DynamicForm'

export function buildClienteSections(): FormSection[] {
  return [
    {
      title: 'Datos del cliente',
      icon: '👤',
      fields: [
        {
          name: 'nombre',
          label: 'Nombre',
          type: 'text',
          required: true,
          placeholder: 'Ej: Juan Pérez',
        },
        {
          name: 'correo',
          label: 'Correo electrónico',
          type: 'email',
          required: true,
          placeholder: 'nombre@dominio.com',
        },
        { name: 'nroTelefono', label: 'Teléfono', type: 'text', placeholder: 'Ej: 0981 123 456' },
        { name: 'ruc', label: 'RUC', type: 'text', required: true, placeholder: 'Ej: 80012345-6' },
      ],
    },
  ]
}
