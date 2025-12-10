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

      {/* Contenedor */}
      <div className="relative z-10 flex flex-col h-full p-4">
        <div className="bg-white/60 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h2 className="text-2xl font-bold text-brand-blue dark:text-white mb-1">
              ¡Bienvenido de nuevo! 👋    
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-lg">
              {user?.nombre} {user?.apellido}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user?.correo}</p>

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

        
          {/* Cards */}
          <div className="flex-1 overflow-auto p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProfileCard
                title="Mi Perfil"
                icon="👤"
                description="Visualiza tu información personal"
                onClick={() => navigate('/profile')}
                borderClass="border-blue-600"
                buttonClass="bg-blue-600 hover:bg-blue-700"
                color=""
              />

              <ProfileCard
                title="Solicitudes"
                icon="📝"
                description="Crea y revisa tus solicitudes"
                onClick={() => navigate('/requests')}
                borderClass="border-blue-600"
                buttonClass="bg-blue-600 hover:bg-blue-700"
                color=""
              />

              <ProfileCard
                title="Solicitar Dispositivos"
                icon="📱"
                description="Crea y revisa tus peticiones de dispositivos"
                onClick={() => navigate('/requests')}
                borderClass="border-blue-600"
                buttonClass="bg-blue-600 hover:bg-blue-700"
                color=""
              />
              <ProfileCard
                title="Beneficios"
                icon="🎁"
                description="Explora y accede a tus beneficios"
                onClick={() => navigate('/benefits')}
                borderClass="border-blue-600"
                buttonClass="bg-blue-600 hover:bg-blue-700"
                color=""
              />
            </div>
          </div>
        </div>
      </div>
      </div>
  )
}
