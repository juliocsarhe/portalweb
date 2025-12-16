import { useNavigate } from 'react-router'
import { useAuth } from '../../../app/providers/AuthContext'
import ProfileCard from '../components/ProfileCard'

//notificaciones
import NotificationBell from '../../../features/notificaciones/components/NotificationBell'


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

      {/* Contenedor de Bienvenido de nuevo + Botón de notificaciones */}
      <div className="relative z-20 flex flex-col h-120 p-3">
        <div className="bg-white/50 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg flex flex-col h-full overflow-visible">

          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
            <h2 className="text-[30px] font-bold text-brand-blue dark:text-white mb-1">
              Bienvenido de nuevo, {user?.nombre} {user?.apellido}
            </h2>
            <h3 className="text-gray-800 dark:text-white">Últimas Novedades</h3>

            {/* CAMPANA DE NOTIFICACIONES */}
            <div className="absolute top-6 right-6">
              <NotificationBell userId={user?.id} />
            </div>

          </div> {/* cierre Header */}

        </div> {/* cierre card */}
      </div> {/* cierre contenedor principal */}

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






























































// import { useNavigate } from 'react-router'
// import { useAuth } from '../../../app/providers/AuthContext'
// import ProfileCard from '../components/ProfileCard'

// //notificaciones
// import { useNotifications } from '../../../features/notificaciones/hooks/useNotifications'
// import NotificationBell from '../../../features/notificaciones/components/NotificationBell'
// import NotificationPanel from '../../../features/notificaciones/components/NotificationPanel'

// export default function HomePage() {
//   const { user } = useAuth()
//   const navigate = useNavigate()

//   const { open, toggleOpen, notifications } = useNotifications(user?.correo || '')

//   if (!user) return <p>Cargando...</p>

//   return (
//     <div className="h-full flex flex-col overflow-hidden">
//       {/* Fondo */}
//       <div
//         className="absolute inset-0 bg-brand-blue"
//         style={{
//           backgroundImage: "url('/src/assets/ilustracion-herov3.svg')",
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat',
//         }}
//       >
//         <div className="absolute inset-0 bg-brand-blue/40"></div>
//       </div>

//       {/* Contenedor de Bienvenido de nuevo + Botón de notificaciones */}
//       <div className="relative z-20 flex flex-col h-120 p-3">
//         <div className="bg-white/50 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg flex flex-col h-full overflow-visible">

//           {/* Header */}
//           <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
//             <h2 className="text-[30px] font-bold text-brand-blue dark:text-white mb-1">
//               Bienvenido de nuevo, {user?.nombre} {user?.apellido}
//             </h2>
//             <h3 className="text-gray-800 dark:text-white">Últimas Novedades</h3>

//             <div className="absolute top-6 right-6">
//               <NotificationBell
//                 notifications={notifications.length}
//                 onClick={toggleOpen}
//               />

//             </div>

//           </div> {/* cierre Header */}

//         </div> {/* cierre card */}
//       </div> {/* cierre contenedor principal */}

//       {/* Contenedor para el de aviso */}
//       <div className="relative z-20 flex flex-col h-120 p-4">
//         <div className="bg-white/50 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl shadow-lg flex flex-col h-full overflow-hidden">
//           {/* Header */}
//           <div className="p-6 border-b border-gray-200 dark:border-gray-700 shrink-0">
//             <h2 className="text-2xl font-bold text-brand-blue dark:text-white mb-1">
//               ¡Bienvenido de nuevo! 👋
//             </h2>
//           </div>
//         </div>
//       </div>

//     </div>
//   )
// }
