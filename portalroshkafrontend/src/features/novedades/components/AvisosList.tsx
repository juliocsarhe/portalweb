import { NovedadesResponseDto } from '@/types'

export default function AvisosList({
  items,
  onEdit,
  onDelete,
}: {
  items: NovedadesResponseDto[]
  onEdit?: (item: NovedadesResponseDto) => void
  onDelete?: (id: number) => void
}) {
  if (!items.length) {
    return <p className="text-gray-600 dark:text-gray-300">No hay avisos.</p>
  }

  return (
    <ul className="space-y-3">
      {items.map((n) => (
        <li key={n.idNovedades} className="bg-white/70 dark:bg-gray-800/60 rounded-lg p-4 shadow relative">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-semibold text-brand-blue dark:text-white">{n.titulo}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{n.descripcion}</p>
            </div>

            <div className="flex flex-col gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(n)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(n.idNovedades)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
