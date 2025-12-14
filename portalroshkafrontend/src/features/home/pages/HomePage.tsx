// src/pages/HomePage.tsx
import { useAuth } from '../../../app/providers/AuthContext'
import { useGetCarruselPublic, useGetAvisosPublic } from '@/features/novedades/hooks/useGetNovedadesPublic'
import CarruselNovedades from '@/features/novedades/components/CarruselNovedades'
import AvisosList from '@/features/novedades/components/AvisosList'

export default function HomePage() {
  const { user } = useAuth()
  const { data: carrusel, loading: loadingCarrusel, error: errorCarrusel } = useGetCarruselPublic()
  const { data: avisos, loading: loadingAvisos, error: errorAvisos } = useGetAvisosPublic()

  if (!user) return <p>Cargando usuario...</p>

  return (
    <div className="relative min-h-screen h-screen bg-gradient-to-br from-[#1a1d3f] via-[#252850] to-[#2a2d5a] dark:from-[#0f1123] dark:via-[#1a1d3f] dark:to-[#1f2241] overflow-hidden">
      {/* Decoraciones de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ECB22E]/10 dark:bg-[#ECB22E]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Contenido principal con scroll */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="p-6 space-y-6 pb-20">
          {/* Bienvenida */}
          <div>
            <h2 className="text-[30px] font-bold text-white">
              Bienvenido de nuevo, {user?.nombre} {user?.apellido}
            </h2>
            <p className="text-gray-300">Últimas Novedades</p>
          </div>

          {/* Carrusel */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Novedades Destacadas
            </h2>

            {loadingCarrusel ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-300">Cargando carrusel...</p>
              </div>
            ) : errorCarrusel ? (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-300">Error al cargar el carrusel: {errorCarrusel}</p>
              </div>
            ) : carrusel.length > 0 ? (
              <CarruselNovedades items={carrusel} />
            ) : (
              <div className="bg-white/5 rounded-lg p-8 text-center">
                <p className="text-gray-400">No hay novedades con imagen disponibles</p>
              </div>
            )}
          </div>

          {/* Avisos */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <h2 className="text-xl font-semibold text-white">Avisos Importantes</h2>
            </div>

            {loadingAvisos ? (
              <p className="text-gray-300">Cargando avisos...</p>
            ) : errorAvisos ? (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-300">Error al cargar avisos: {errorAvisos}</p>
              </div>
            ) : avisos.length > 0 ? (
              <div className="max-h-96 overflow-y-auto pr-2">
                <AvisosList items={avisos} />
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-8 text-center">
                <p className="text-gray-400">No hay avisos disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón de notificación flotante */}
      <button className="fixed top-6 right-6 bg-[#2a2d5a] border border-[#3a3d6a] p-3 rounded-full hover:bg-[#ECB22E] hover:border-[#ECB22E] transition-all duration-300 shadow-lg z-50">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
    </div>
  )
}