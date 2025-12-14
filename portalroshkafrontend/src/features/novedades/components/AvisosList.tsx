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

  // Detectar si hay una URL en el texto
  const extractUrl = (text: string): string | null => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const match = text.match(urlRegex)
    return match ? match[0] : null
  }

  return (
    <ul className="space-y-3">
      {items.map((n) => {
        const url = extractUrl(n.descripcion)
        
        return (
          <li 
            key={n.idNovedades} 
            className="bg-white/70 dark:bg-gray-800/60 rounded-lg p-4 shadow relative group hover:bg-white/90 dark:hover:bg-gray-800/80 transition-all"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <svg 
                    className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#ECB22E] transition-colors flex-shrink-0 mt-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <h3 className="font-semibold text-brand-blue dark:text-white">
                    {n.titulo}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 ml-6">
                  {n.descripcion}
                </p>

                {/* Si detecta una URL, mostrar botón para ir */}
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 ml-6 text-xs text-[#ECB22E] hover:text-[#d9a429] font-medium hover:underline"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Abrir enlace
                  </a>
                )}
              </div>

              {/* Botones de edición/eliminación (solo para admin) */}
              {(onEdit || onDelete) && (
                <div className="flex flex-col gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(n)}
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(n.idNovedades)}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}