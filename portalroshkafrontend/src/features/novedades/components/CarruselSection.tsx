import CarruselNovedades from './CarruselNovedades'
import AvisosList from './AvisosList'
import { NovedadesResponseDto } from '@/types'

type Props = {
  items: NovedadesResponseDto[]
  onEdit: (n: NovedadesResponseDto) => void
  onDelete: (id: number) => void
}

export default function CarruselSection({ items, onEdit, onDelete }: Props) {
  if (!items.length) return null

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-[#ECB22E] text-2xl">
          photo_library
        </span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Carrusel con imagen
        </h2>
      </div>

      <CarruselNovedades items={items} />

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Gestionar Carrusel
        </h3>
        <AvisosList items={items} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  )
}