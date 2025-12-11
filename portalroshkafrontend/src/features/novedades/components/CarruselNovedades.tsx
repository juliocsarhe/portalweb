import { useEffect, useState } from 'react'
import { NovedadesResponseDto } from '@/types'

export default function CarruselNovedades({ items }: { items: NovedadesResponseDto[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!items.length) return
    const interval = setInterval(() => {
      if (!paused) setIndex((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [items.length, paused])

  useEffect(() => {
    // make sure index is within bounds if items change
    if (index >= items.length && items.length > 0) setIndex(0)
  }, [items.length, index])

  if (!items.length) {
    return <p className="text-gray-600 dark:text-gray-300">No hay novedades con imagen.</p>
  }

  return (
    <div
      className="relative w-full h-56 rounded-xl overflow-hidden shadow-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((it, i) => (
        <div
          key={it.idNovedades}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img src={it.imagenUrl} alt={it.titulo} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div>
              <h3 className="text-white text-lg font-bold drop-shadow">{it.titulo}</h3>
              {it.descripcion && (
                <p className="text-white/90 text-sm mt-1 line-clamp-2">{it.descripcion}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next */}
      <button
        aria-label="Anterior"
        onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2"
      >
        ‹
      </button>
      <button
        aria-label="Siguiente"
        onClick={() => setIndex((i) => (i + 1) % items.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? 'scale-110 bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
