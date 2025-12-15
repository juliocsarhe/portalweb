import { useState, useEffect } from 'react'

const DEFAULT_ITEMS = [
  {
    id: 'default-1',
    imagenUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    titulo: 'Título de ejemplo 1',
    descripcion: 'Descripción corta de ejemplo 1. Esta es una descripción más larga que se puede expandir para mostrar todo el contenido cuando el usuario hace clic en "Ver más".',
    contenido: 'Contenido completo del aviso 1 con <a href="https://example.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">link de ejemplo</a>',
  },
  {
    id: 'default-2',
    imagenUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    titulo: 'Título de ejemplo 2',
    descripcion: 'Descripción corta de ejemplo 2. Aquí hay más texto que se mostrará cuando expandas.',
    contenido: 'Contenido completo del aviso 2 con <a href="https://google.com" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300">otro enlace</a>',
  },
]

export default function CarruselNovedades({ items }) {
  const displayItems = items && items.length > 0 ? items : DEFAULT_ITEMS
  const [index, setIndex] = useState(0)
  const [showFull, setShowFull] = useState(false)
  const [paused, setPaused] = useState(false)

  const currentItem = displayItems[index]

  // Cambio automático cada 5 segundos
  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayItems.length)
      setShowFull(false)
    }, 5000)
    return () => clearInterval(interval)
  }, [displayItems.length, paused])

  const prevSlide = () => {
    setIndex((i) => (i - 1 + displayItems.length) % displayItems.length)
    setShowFull(false)
  }

  const nextSlide = () => {
    setIndex((i) => (i + 1) % displayItems.length)
    setShowFull(false)
  }

  return (
    <div
      className="relative w-full bg-white dark:bg-gray-900/70 rounded-2xl shadow-lg border border-white/20 p-6 pb-16 flex flex-col md:flex-row items-center gap-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Flecha izquierda */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition z-10"
        aria-label="Anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Contenido a la izquierda */}
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="self-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {currentItem.titulo}
        </h3>

        {/* Descripción - colapsada o expandida */}
        <div className={`self-center text-gray-700 dark:text-gray-300 ${showFull ? '' : 'line-clamp-3'} text-center`}>
          {currentItem.descripcion}
        </div>

        {/* Contenido con links - solo se muestra cuando está expandido */}
        {showFull && currentItem.contenido && (
          <div
            className="self-center text-gray-800 dark:text-gray-200 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-md border border-gray-300 dark:border-gray-700 w-full"
            dangerouslySetInnerHTML={{ __html: currentItem.contenido }}
          />
        )}

        <button
          onClick={() => setShowFull(!showFull)}
          className="mt-auto self-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          {showFull ? 'Ocultar' : 'Ver más'}
        </button>
      </div>

      {/* Imagen a la derecha */}
      <div className="flex-1 relative">
        <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-800">
          <img
            src={currentItem.imagenUrl}
            alt={currentItem.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Flecha derecha */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition z-10"
        aria-label="Siguiente"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores - centrados horizontalmente en la parte inferior */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {displayItems.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i)
              setShowFull(false)
            }}
            className={`transition-all rounded-full ${
              i === index
                ? 'w-8 h-3 bg-blue-600 dark:bg-white'
                : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
            }`}
            aria-label={`Ir a novedad ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}