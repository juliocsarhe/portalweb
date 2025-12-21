import { useAuth } from '../../../app/providers/AuthContext'
import {
  useGetCarruselPublic,
  useGetAvisosPublic,
} from '@/features/novedades/hooks/useGetNovedadesPublic'
import CarruselNovedades from '@/features/novedades/components/CarruselNovedades'
import AvisosList from '@/features/novedades/components/AvisosList'

// 🔔 notificaciones
import NotificationBell from '../../../features/notificaciones/components/NotificationBell'
import { useState } from 'react'

export default function HomePage() {
  const { user } = useAuth()
  const { data: carrusel, loading: loadingCarrusel, error: errorCarrusel } = useGetCarruselPublic()
  const { data: avisos, loading: loadingAvisos, error: errorAvisos } = useGetAvisosPublic()
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  if (!user) return <p>Cargando usuario...</p>

  const sortAvisos = (avisosList: typeof avisos) => {
    return [...avisosList].sort((a, b) => {
      const prioridadA = !!a.prioridad
      const prioridadB = !!b.prioridad

      if (prioridadA && !prioridadB) return -1
      if (!prioridadA && prioridadB) return 1

      const fechaA = new Date(a.fechaExpiracion + 'T00:00').getTime()
      const fechaB = new Date(b.fechaExpiracion + 'T00:00').getTime()

      return fechaA - fechaB
    })
  }

  const avisosOrdenados = sortAvisos(avisos ?? [])

  return (
    <div className="relative h-screen overflow-hidden">
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

      <div className="relative z-10 h-full overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[32px] font-bold text-white mb-1">
                Bienvenido de nuevo, {user.nombre} {user.apellido}
              </h2>
              <p className="text-white/90 text-lg">Últimas Novedades</p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm border border-white/30 p-3 rounded-full hover:bg-[#ECB22E] hover:border-[#ECB22E] transition-all duration-300 shadow-lg">
              <NotificationBell userId={user.idUsuario} userRol={user.rol?.idRol} />
            </div>
          </div>

          <div className="bg-white/45 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg border border-white/20 pl-15 pr-15 pb-4 pt-4">
            {loadingCarrusel ? (
              <div className="ml-5 flex items-center justify-center h-48">
                <p className="text-gray-600">Cargando carrusel...</p>
              </div>
            ) : errorCarrusel ? (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-600">Error al cargar el carrusel: {errorCarrusel}</p>
              </div>
            ) : (
              <CarruselNovedades
                items={(carrusel ?? []).map((c) => ({
                  id: c.idNovedades,
                  titulo: c.titulo,
                  descripcion: c.descripcion,
                  imagenUrl: c.imagenUrl,
                  contenido: '',
                }))}
                onImageClick={(imgUrl) => setPreviewImage(imgUrl)}
              />
            )}
          </div>

          <div className="bg-white/45 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="flex items-center gap-3 p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <span className="material-symbols-outlined text-gray-900 dark:text-[#ECB22E] text-2xl">
                campaign
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">AVISOS</h2>
            </div>

            <div className="p-6 pt-4">
              {loadingAvisos ? (
                <p className="text-gray-600">Cargando avisos...</p>
              ) : errorAvisos ? (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-600">Error al cargar avisos: {errorAvisos}</p>
                </div>
              ) : avisosOrdenados.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  <AvisosList items={avisosOrdenados} />
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No hay avisos disponibles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-8 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-7xl max-h-full animate-scale-in">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-white text-2xl">close</span>
            </button>

            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
