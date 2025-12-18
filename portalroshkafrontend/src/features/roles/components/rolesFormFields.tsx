import type { FormSection } from '../../../shared/ui/components/DynamicForm'
import maletasRol from '@/assets/maleta_darkmode.svg'

export function buildRolSections(): FormSection[] {
  return [
    {
      title: 'Datos del rol',
      icon: (
        <img
          src={maletasRol}
          alt="Cargo"
          className="w-full h-full object-contain bg-[#1A1F37] rounded-[8px]"
        />
      ),
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
