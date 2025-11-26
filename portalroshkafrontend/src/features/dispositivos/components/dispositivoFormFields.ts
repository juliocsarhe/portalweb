// src/config/forms/dispositivoFormFields.ts
import type { FormSection } from '../../../shared/ui/components/DynamicForm'
import {
  EstadoInventarioEnum,
  EstadoInventarioLabels,
  CategoriaEnum,
  CategoriaLabels,
} from '../../../types'

export function buildDispositivoSections(
  tiposDispositivo: { value: number; label: string }[] = [],
  ubicaciones: { value: number; label: string }[] = [],
  usuarios: { value: number; label: string }[] = []
): FormSection[] {
  return [
    {
      title: 'Información básica',
      icon: '💻',
      fields: [
        { name: 'nroSerie', label: 'Número de serie', type: 'text', required: true },
        { name: 'modelo', label: 'Modelo', type: 'text', required: true },
        { name: 'detalle', label: 'Detalles', type: 'text' },
        { name: 'fechaFabricacion', label: 'Fecha de fabricación', type: 'date' },
      ],
    },
    {
      title: 'Clasificación',
      icon: '📦',
      fields: [
        {
          name: 'tipoDispositivo',
          label: 'Tipo de dispositivo',
          type: 'select',
          required: true,
          options: tiposDispositivo,
        },
        {
          name: 'categoria',
          label: 'Categoría',
          type: 'select',
          required: true,
          options: Object.values(CategoriaEnum).map((value) => ({
            value,
            label: CategoriaLabels[value],
          })),
        },
        {
          name: 'estado',
          label: 'Estado',
          type: 'select',
          required: true,
          options: Object.values(EstadoInventarioEnum).map((value) => ({
            value,
            label: EstadoInventarioLabels[value],
          })),
        },
      ],
    },
    {
      title: 'Asignación',
      icon: '👤',
      fields: [
        {
          name: 'ubicacion',
          label: 'Ubicación',
          type: 'select',
          required: true,
          options: ubicaciones,
        },
        {
          name: 'encargado',
          label: 'Encargado',
          type: 'select',
          required: false,
          options: usuarios,
        },
      ],
    },
  ]
}
