import type { FormSection } from '../../../shared/ui/components/DynamicForm'
import espacioBlanco from '@/assets/espacio_blanconegro.svg'

export function buildCargoSections(): FormSection[] {
  return [
    {
      title: 'Datos del cargo',
      icon: <img src={espacioBlanco} alt="Cargo" className="w-full h-full object-contain bg-[#1A1F37] rounded-[8px]" />,
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