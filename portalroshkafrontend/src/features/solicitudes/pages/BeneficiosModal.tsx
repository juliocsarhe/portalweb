import { useState } from 'react'

interface Beneficio {
  id: number
  nombre: string
  descripcion: string
  imagen: string
}

interface Props {
  show: boolean
  onClose: () => void
  onSelect: (beneficio: Beneficio) => void
  selectedId?: number
}

export default function BeneficiosModal({ show, onClose, onSelect, selectedId }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const beneficios: Beneficio[] = [
    {
      id: 9,
      nombre: 'Préstamos',
      descripcion: 'Préstamos sin intereses!',
      imagen: '/src/assets/image9.png',
    },
    {
      id: 10,
      nombre: 'Capacitaciones',
      descripcion: 'Financiación y 50 horas libres al año',
      imagen: '/src/assets/image10.png',
    },
    {
      id: 11,
      nombre: 'Nutricionista',
      descripcion: 'Convenio con nutricionista y cuota automática',
      imagen: '/src/assets/image11.png',
    },
    {
      id: 12,
      nombre: 'Gym',
      descripcion: 'Convenio con el gym FITTEST',
      imagen: '/src/assets/image12.png',
    },
  ]

  if (!show) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden animate-scale-in">
          <div className="bg-[#192550] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-white text-3xl">
                card_giftcard
              </span>
              <div>
                <h2 className="text-[19px] font-bold text-white">Selecciona un Beneficio</h2>
                <p className="text-black/80 dark:text-white/80 text-[15px]">
                  Elige el beneficio que deseas solicitar
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-white">close</span>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {beneficios.map((beneficio) => (
                <div
                  key={beneficio.id}
                  className={`relative p-4 border-2 rounded-xl transition-all hover:shadow-lg ${
                    selectedId === beneficio.id
                      ? 'border-[#3949AB] bg-[#3949AB]/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-[#3949AB]'
                  }`}
                >
                  {selectedId === beneficio.id && (
                    <div className="absolute top-2 right-2 bg-[#3949AB] text-white rounded-full w-6 h-6 flex items-center justify-center z-10">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                  )}

                  <div 
                    className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-gray-100 dark:bg-gray-700 cursor-zoom-in relative group"
                    onClick={(e) => {
                      e.stopPropagation()
                      setImagePreview(beneficio.imagen)
                    }}
                  >
                    <img
                      src={beneficio.imagen}
                      alt={beneficio.nombre}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=' + beneficio.nombre
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-4xl">
                        zoom_in
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {beneficio.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {beneficio.descripcion}
                    </p>
                    <button
                      onClick={() => {
                        onSelect(beneficio)
                        onClose()
                      }}
                      className="w-full py-2 bg-[#3949AB] hover:bg-[#4a5bbc] text-white rounded-lg transition-colors font-medium text-sm"
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {imagePreview && (
        <>
          <div
            className="fixed inset-0 bg-black/90 z-[60] animate-fade-in"
            onClick={() => setImagePreview(null)}
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
            <div className="relative max-w-5xl max-h-full animate-scale-in">
              <button
                onClick={() => setImagePreview(null)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-white text-2xl">
                  close
                </span>
              </button>

              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
                onClick={() => setImagePreview(null)}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}