import { Beneficio } from "@/types"

export default function MasBeneficios() {
  const beneficiosAdicionales = [
    {
      id: 1,
      nombre: 'Horarios',
      descripcion: 'Esquemas flexibles mientras no afecte tu productividad',
      imagen: '/src/assets/image1.png',
    },
    {
      id: 2,
      nombre: 'Reposos',
      descripcion: 'Roshka cubre el otro 50% que ips no cubre!',
      imagen: '/src/assets/image2.png',
    },
    {
      id: 3,
      nombre: 'Cumpleaños',
      descripcion: 'Día libre por tu cumpleaños!',
      imagen: '/src/assets/image3.png',
    },
    {
      id: 4,
      nombre: 'Examenes Finales o Tesis',
      descripcion: 'Días libres para concentrarte en tus estudios',
      imagen: '/src/assets/image4.png',
    },
    {
      id: 5,
      nombre: 'Matrimonio',
      descripcion: 'Días libres y bonos!',
      imagen: '/src/assets/image5.png',
    },
    {
      id: 6,
      nombre: 'Luto',
      descripcion: 'Días de licencia para apoyar al trabajador y ayuda social',
      imagen: '/src/assets/image6.png',
    },
    {
      id: 7,
      nombre: 'Permiso por nacimiento',
      descripcion: 'Días libres y obsequios!',
      imagen: '/src/assets/image7.png',
    },
    {
      id: 8,
      nombre: 'Viernes 4 you',
      descripcion: 'Un viernes de salida temprana al mes!',
      imagen: '/src/assets/image8.png',
    },
    {
      id: 13,
      nombre: 'Graduación',
      descripcion: 'Regalos para los nuevos egresados',
      imagen: '/src/assets/image13.png',
    },
    {
      id: 14,
      nombre: 'Frutas y snacks',
      descripcion: 'Snacks para merienda y desayuno saludable',
      imagen: '/src/assets/image14.png',
    },
  ]

  return (
    <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#3949AB] to-[#5E35B1] rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-2xl">
            star
          </span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Más Beneficios
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Descubre otros beneficios que tenemos para ti
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beneficiosAdicionales.map((beneficio) => (
          <div
            key={beneficio.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-[#3949AB] hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#3949AB]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#3949AB] transition-colors">
                <span className="material-symbols-outlined text-[#3949AB] group-hover:text-white transition-colors">
                  
                </span>
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {beneficio.nombre}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {beneficio.descripcion}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}