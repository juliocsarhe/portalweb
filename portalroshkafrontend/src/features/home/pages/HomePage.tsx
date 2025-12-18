// src/pages/HomePage.tsx

import { useAuth } from '../../../app/providers/AuthContext'
import {
  useGetCarruselPublic,
  useGetAvisosPublic,
} from '@/features/novedades/hooks/useGetNovedadesPublic'
import CarruselNovedades from '@/features/novedades/components/CarruselNovedades'
import AvisosList from '@/features/novedades/components/AvisosList'

//notificaciones
import NotificationBell from '../../../features/notificaciones/components/NotificationBell'
import { useNotifications } from '../../../features/notificaciones/hooks/useNotifications'  

export default function HomePage() {
  const { user } = useAuth()
  const { data: carrusel, loading: loadingCarrusel, error: errorCarrusel } = useGetCarruselPublic()
  const { data: avisos, loading: loadingAvisos, error: errorAvisos } = useGetAvisosPublic()

  if (!user) return <p>Cargando usuario...</p>

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Fondo ilustrativo */}
      <div
        className="absolute inset-0 bg-brand-blue"
        style={{
          backgroundImage: "url('/src/assets/ilustracion-herov3.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-brand-blue/70 dark:bg-brand-blue/80"></div>
      </div>

      {/* Contenido principal con scroll */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header con bienvenida y botón de notificación */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[32px] font-bold text-white dark:text-white mb-1">
                Bienvenido de nuevo, {user?.nombre} {user?.apellido}
              </h2>
              <p className="text-white/90 dark:text-gray-300 text-lg">Últimas Novedades</p>
            </div>

            {/* Botón de notificación */}
            <button className="bg-white/20 backdrop-blur-sm border border-white/30 p-3 rounded-full hover:bg-[#ECB22E] hover:border-[#ECB22E] transition-all duration-300 shadow-lg group">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>

          {/* Carrusel de Novedades */}
          <div className="bg-white/45 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg border border-white/20 pl-15 pr-15 pb-4 pt-4">
            {loadingCarrusel ? (
              <div className="ml-5 flex items-center justify-center h-48">
                <p className="text-gray-600 dark:text-gray-300">Cargando carrusel...</p>
              </div>
            ) : errorCarrusel ? (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-300">
                  Error al cargar el carrusel: {errorCarrusel}
                </p>
              </div>
            ) : (
              <div className="max-h-[400px]">
                <CarruselNovedades items={carrusel ?? []} />
              </div>
            )}
          </div>

          {/* Avisos Importantes */}
          <div className="bg-white/45 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="flex items-center gap-3 p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <span className="material-symbols-outlined text-gray-900 dark:text-white text-2xl">
                campaign
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AVISOS</h2>
            </div>

            <div className="p-6 pt-4">
              {loadingAvisos ? (
                <p className="text-gray-600 dark:text-gray-300">Cargando avisos...</p>
              ) : errorAvisos ? (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-300">
                    Error al cargar avisos: {errorAvisos}
                  </p>
                </div>
              ) : avisos.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  <AvisosList items={avisos} />
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No hay avisos disponibles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

