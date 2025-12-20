import DataTable from '@/shared/ui/components/DataTable'
import { NovedadesResponseDto } from '@/types'

type Props = {
  items: NovedadesResponseDto[]
  onEdit: (n: NovedadesResponseDto) => void
  onDelete: (id: number) => void
}

export default function NovedadesTable({ items, onEdit, onDelete }: Props) {
  return (
    <DataTable
      data={items}
      rowKey={(n) => n.idNovedades}
      scrollable={false}
      columns={[
        { key: 'titulo', label: 'Título' },
        { key: 'descripcion', label: 'Descripción' },
        {key: 'fechaExpiracion', label: 'Fecha de Expiracion'}
      ]}
      actions={(n) => (
        <div className="flex gap-10 text-center">
          <button
            onClick={() => onEdit(n)}
            className="px-3 py-1.5 text-sm bg-blue-400 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(n.idNovedades)}
            className="px-3 py-1.5 text-sm bg-red-400 hover:bg-red-700 text-white rounded-md transition-colors font-medium"
          >
            Eliminar
          </button>
        </div>
      )}
    />
  )
}