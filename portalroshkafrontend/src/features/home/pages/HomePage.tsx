import CarruselNovedades from '@/features/novedades/components/CarruselNovedades';
import AvisosList from '@/features/novedades/components/AvisosList';
import { useGetCarruselPublic, useGetAvisosPublic } from '@/features/novedades/hooks/useGetNovedadesPublic';

export default function HomePage() {
  const { data: carrusel, loading: loadingCarrusel } = useGetCarruselPublic();
  const { data: avisos, loading: loadingAvisos } = useGetAvisosPublic();

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

      {/* Contenedor Carrusel */}
      <div className="relative z-20 flex flex-col h-250 p-1.5">
        <div className="bg-white/50 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h2 className="text-[30px] font-bold text-brand-blue dark:text-white mb-1">
              Últimas Novedades
            </h2>
            {loadingCarrusel ? (
              <p className="text-gray-700 dark:text-gray-300">Cargando...</p>
            ) : (
              <CarruselNovedades items={carrusel} />
            )}
          </div>
        </div>
      </div>

      {/* Contenedor Avisos */}
      <div className="relative z-20 flex flex-col h-120 p-4">
        <div className="bg-white/50 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h2 className="text-2xl font-bold text-brand-blue dark:text-white mb-3">
              Avisos
            </h2>
            {loadingAvisos ? (
              <p className="text-gray-700 dark:text-gray-300">Cargando...</p>
            ) : (
              <div className="max-h-80 overflow-y-scroll">
                <AvisosList items={avisos} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
