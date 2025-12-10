import { useNavigate } from 'react-router'
import { useAuth } from '../../../app/providers/AuthContext'
import ProfileCard from '../components/ProfileCard'

//notificaciones
import { useNotifications } from '../../../features/notificaciones/hooks/useNotifications'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { open, toggleOpen, notifications } = useNotifications()

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

      {/* Contenedor de Bienvenido de nuevo + Botón de notificaciones */}
      <div className="relative z-20 flex flex-col h-120 p-3">
        <div className="bg-white/50 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg flex flex-col h-full overflow-visible">

          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h2 className="text-[30px] font-bold text-brand-blue dark:text-white mb-1">
              Bienvenido de nuevo, {user?.nombre} {user?.apellido}
            </h2>
            <h3 className="text-gray-800 dark:text-white">Últimas Novedades</h3>

            {/* Botón de notificaciones */}
            <div className="absolute top-6 right-6">
              <button
                onClick={toggleOpen}
                className="relative text-2xl p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                🔔

                {/* Contador */}
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Panel de notificaciones */}
              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4">
                  <h3 className="font-bold mb-2 text-white">Notificaciones</h3>

                  {notifications.map((n, i) => (
                    <p key={i} className="text-sm text-gray-700 dark:text-gray-200 py-1">
                      • {n}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor para el de aviso */}
      <div className="relative z-20 flex flex-col h-120 p-4">
        <div className="bg-white/50 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h2 className="text-2xl font-bold text-brand-blue dark:text-white mb-1">
              ¡Bienvenido de nuevo! 👋    
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
