// src/pages/HomePage.tsx
import { useAuth } from '../../../app/providers/AuthContext'
import { useGetCarruselPublic, useGetAvisosPublic } from '@/features/novedades/hooks/useGetNovedadesPublic'
import CarruselNovedades from '@/features/novedades/components/CarruselNovedades'
import AvisosList from '@/features/novedades/components/AvisosList'
import PageLayout from '@/layouts/PageLayout'

export default function HomePage() {
  const { user } = useAuth()
  const { data: carrusel, loading: loadingCarrusel, error: errorCarrusel } = useGetCarruselPublic()
  const { data: avisos, loading: loadingAvisos, error: errorAvisos } = useGetAvisosPublic()

  if (!user) return <p>Cargando usuario...</p>

  return (
    <PageLayout>
      <div className="relative min-h-screen space-y-6 overflow-x-hidden">
        {/* Bienvenida */}
        <div className="">
          <h2 className="text-[30px] font-bold text-brand-blue dark:text-white">
            Bienvenido de nuevo, {user?.nombre} {user?.apellido}
          </h2>
          <p className="text-gray-800 dark:text-gray-200">
            Últimas Novedades
          </p>
        </div>

        {/* Carrusel */}
        <div className="bg-white/50 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-brand-blue dark:text-white">
            Novedades Destacadas
          </h2>

          {loadingCarrusel ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-700 dark:text-gray-300">Cargando carrusel...</p>
            </div>
          ) : errorCarrusel ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">
                Error al cargar el carrusel: {errorCarrusel}
              </p>
            </div>
          ) : carrusel.length > 0 ? (
            <CarruselNovedades items={carrusel} />
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                No hay novedades con imagen disponibles en este momento
              </p>
            </div>
          )}
        </div>

        {/* Avisos */}
        <div className="bg-white/50 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-brand-blue dark:text-white">
            Avisos Importantes
          </h2>

          {loadingAvisos ? (
            <p className="text-gray-700 dark:text-gray-300">Cargando avisos...</p>
          ) : errorAvisos ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">
                Error al cargar avisos: {errorAvisos}
              </p>
            </div>
          ) : avisos.length > 0 ? (
            <div className="max-h-96 overflow-y-auto pr-2">
              <AvisosList items={avisos} />
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                No hay avisos disponibles en este momento
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}