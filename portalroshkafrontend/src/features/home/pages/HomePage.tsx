import { useNavigate } from 'react-router'

import { useAuth } from '../../../app/providers/AuthContext'
import ProfileCard from '../components/ProfileCard'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) return <p>Cargando...</p>

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-brand-blue"
        style={{
          backgroundImage: "url('/src/assets/ilustracion-herov3.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-brand-blue/40"></div>
      </div>

      {/* Contenedor */}

      <div className="relative z-10 flex flex-col h-full p-4">
        <div className="bg-white/60 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h2 className="text-2xl font-bold text-brand-blue dark:text-white mb-1">
              Bienvenido de nuevo, {user?.nombre} {user?.apellido}
            </h2>
            <h3 className="text-gray-800 dark:text-white">Últimas Novedades</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
