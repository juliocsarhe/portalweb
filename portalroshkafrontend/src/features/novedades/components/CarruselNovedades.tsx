import { useState, useEffect } from 'react'

const DEFAULT_ITEMS = [
  {
    id: 'default-1',
    imagenUrl: 'src/assets/roshka.jpg',
    titulo: 'Estás al día con las novedades',
    descripcion: 'Ya estás informado con lo más reciente! ',
  },
]

export default function CarruselNovedades({ items }) {
  const displayItems = items && items.length > 0 ? items : DEFAULT_ITEMS
  const [index, setIndex] = useState(0)
  const [showFull, setShowFull] = useState(false)
  const [paused, setPaused] = useState(false)

  const currentItem = displayItems[index]

  const siesDefault = displayItems.length == 1 && displayItems[0].id === 'default-1'

  useEffect(() => {
    if (paused || siesDefault) return
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

  const textoLink = (text: string | undefined) => {
    if (!text) return ''

    const urlRegex = /(https?:\/\/[^\s]+)/g

    return text.replace(
      urlRegex,
      (url) =>
        `<a 
        href="${url}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="text-blue-900 dark:text-blue-500 hover:underline break-all"
      >
        ${url}
      </a>`
    )
  }

  return (
    <div className="relative w-full">
      
      {!siesDefault && (
        <button
          onClick={prevSlide}
          className="absolute left-[-53px] top-1/2 -translate-y-1/2 hover:bg-black/70 text-white rounded-full p-3 transition z-10"
          aria-label="Anterior"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}
      <div
        className="relative w-full rounded-2xl shadow-xl p-6 pb-16 flex flex-col md:flex-row items-center gap-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex-1 flex flex-col gap-4">
          <h3 className="self-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {currentItem.titulo}
          </h3>
          <div
            className={`self-center text-black dark:text-gray-300 ${
              showFull ? '' : 'line-clamp-3'
            } text-center`}
            dangerouslySetInnerHTML={{
              __html: textoLink(currentItem.descripcion),
            }}
          />

          {showFull && currentItem.contenido && (
            <div
              className="self-center text-gray-800 dark:text-gray-200 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-md border border-gray-300 dark:border-gray-700 w-full"
              dangerouslySetInnerHTML={{
                __html: currentItem.contenido,
              }}
            />
          )}
        </div>

        <div className="flex-1 relative">
          <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-800">
            <img
              src={currentItem.imagenUrl}
              alt={currentItem.titulo}
              className="w-full h-full object-cover" // la foto
            />
          </div>
        </div>

        {!siesDefault && (
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
        )}
      </div>
      {/* flecha-siguiente */}
      {!siesDefault && (
        <button
          onClick={nextSlide}
          className="absolute right-[-53px] top-1/2 -translate-y-1/2 hover:bg-black/70 text-white rounded-full p-3 transition z-10"
          aria-label="Siguiente"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
