import { useEffect, useState } from 'react'
import { NovedadesResponseDto } from '@/types'

// imagenes de prueba por si no hay nada que mostrar en algun momento, a edicion
const DEFAULT_IMAGES = [
  {
    id: 'default-1',
    imagenUrl: 'src\assets\roshka.jpg',
    titulo: 'Bienvenido',
    descripcion: 'La Vanguardia es así'
  },
  {
    id: 'default-2',
    imagenUrl: 'src\assets\roshka.jpg',
    titulo: 'Colaboración',
    descripcion: 'Trabajamos juntos para alcanzar nuestros objetivos'
  },
  {
    id: 'default-3',
    imagenUrl: 'src\assets\roshka.jpg',
    titulo: 'Innovación',
    descripcion: 'Siempre buscando nuevas formas de mejorar'
  }
]

export default function CarruselNovedades({ items }: { items: NovedadesResponseDto[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Usar imágenes por defecto si no hay items
  const displayItems = items.length > 0 ? items : DEFAULT_IMAGES

  useEffect(() => {
    if (!displayItems.length) return
    const interval = setInterval(() => {
      if (!paused) setIndex((prev) => (prev + 1) % displayItems.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [displayItems.length, paused])

  useEffect(() => {
    if (index >= displayItems.length && displayItems.length > 0) setIndex(0)
  }, [displayItems.length, index])

  if (!displayItems.length) {
    return <p className="text-gray-600 dark:text-gray-300">No hay novedades disponibles.</p>
  }

  // Calcular índices para mostrar 3 imágenes
  const prevIndex = (index - 1 + displayItems.length) % displayItems.length
  const nextIndex = (index + 1) % displayItems.length

  const getItem = (idx: number) => displayItems[idx]

  return (
    <div
      className="relative w-full py-8 px-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* contenedor de las 3 fotos */}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {/* imagen izquierda */}
        <div className="relative w-1/4 md:w-1/5 transition-all duration-700 ease-out opacity-60 scale-90">
          <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-md">
            <img
              src={getItem(prevIndex).imagenUrl}
              alt={getItem(prevIndex).titulo}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* la imagen del medio */}
        <div className="relative w-2/4 md:w-2/5 transition-all duration-700 ease-out z-10">
          <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
            <img
              src={getItem(index).imagenUrl}
              alt={getItem(index).titulo}
              className="w-full h-full object-cover"
            />
            {/* Overlay con información */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
              <div className="w-full">
                <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-lg mb-2">
                  {getItem(index).titulo}
                </h3>
                {getItem(index).descripcion && (
                  <p className="text-white/95 text-sm md:text-base line-clamp-2 drop-shadow">
                    {getItem(index).descripcion}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* imagen lateral */}
        <div className="relative w-1/4 md:w-1/5 transition-all duration-700 ease-out opacity-60 scale-90">
          <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-md">
            <img
              src={getItem(nextIndex).imagenUrl}
              alt={getItem(nextIndex).titulo}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* los botones de izquierda derecha */}
      <button
        aria-label="Anterior"
        onClick={() => setIndex((i) => (i - 1 + displayItems.length) % displayItems.length)}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all z-20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        aria-label="Siguiente"
        onClick={() => setIndex((i) => (i + 1) % displayItems.length)}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all z-20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-6">
        {displayItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all rounded-full ${
              i === index
                ? 'w-8 h-3 bg-brand-blue dark:bg-white'
                : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
            }`}
            aria-label={`Ir a novedad ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}