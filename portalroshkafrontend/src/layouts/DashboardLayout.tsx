import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../app/providers/AuthContext'
import { Roles } from '../types/roles'
import '../shared/ui/styles/scrollbar.css'
import { tieneRol } from '../shared/utils/permisos'

// aca va el side-bar en general para los users

export default function DashboardLayout() {
  const { user, logout } = useAuth()

  const talentoHumano = tieneRol(user, Roles.TALENTO_HUMANO, Roles.DIRECTIVO)
  const operaciones = tieneRol(user, Roles.OPERACIONES, Roles.DIRECTIVO)
  const sysadmin = tieneRol(user, Roles.ADMINISTRADOR_DEL_SISTEMA, Roles.DIRECTIVO)
  const leader = tieneRol(user, Roles.TEAM_LEADER, Roles.DIRECTIVO)
  const novedades = tieneRol(user, Roles.ADMINISTRADOR_DEL_SISTEMA, Roles.TALENTO_HUMANO)

  const menuOptions = [
    {
      id: '/',
      label: <span className="font-semibold text-[15px]">Inicio</span>,
      icon: <span className="material-symbols-outlined weight: 500">home</span>,
      available: true,
      end: true as const,
    },
    {
      id: '/solicitud-dispositivo',
      label: <span className="font-semibold text-[15px]">Solicitar Dispositivos</span>,
      icon: <span className="material-symbols-outlined">devices</span>,
      available: true,
    },
    { id: '/benefits', label: 'Beneficios', available: true },
    {
      id: '/novedades',
      label: <span className="font-semibold text-[15px]">Crear Novedades</span>,
      icon: <span className="material-symbols-outlined">newspaper</span>,
      available: novedades,
    },
    {
      id: '/catalogo-th',
      label: <span className="font-semibold text-[15px]">Cargos y Roles</span>,
      icon: <span className="material-symbols-outlined">group</span>,
      available: talentoHumano,
    },
    {
      id: '/usuarios',
      label: <span className="font-semibold text-[15px]">Funcionarios</span>,
      icon: <span className="material-symbols-outlined">groups_2</span>,
      available: talentoHumano,
    },
    {
      id: '/catalogo-sys',
      label: <span className="font-semibold text-[15px]">Dispositivos y Ubicaciones</span>,
      icon: <span className="material-symbols-outlined">devices_other</span>,
      available: sysadmin,
    },
    {
      id: '/dispositivos',
      label: <span className="font-semibold text-[15px]">Dispositivos</span>,
      icon: <span className="material-symbols-outlined">desktop_windows</span>,
      available: sysadmin,
    },
    {
      id: '/gestion-dispositivos',
      label: <span className="font-semibold text-[15px]">Gestion de Dispositivos</span>,
      icon: <span className="material-symbols-outlined">computer</span>,
      available: sysadmin,
    },
    {
      id: '/catalogo-op',
      label: <span className="font-semibold text-[15px]">Clientes y Tecnologias</span>,
      icon: <span className="material-symbols-outlined">domain</span>,
      available: operaciones,
    },
    {
      id: '/operations',
      label: <span className="font-semibold text-[15px]">Gestion de Equipos</span>,
      icon: <span className="material-symbols-outlined">construction</span>,
      available: operaciones,
    },
    {
      id: '/seleccion-solicitudesTH',
      label: <span className="font-semibold text-[15px]">Gestion de Solicitudes</span>,
      icon: <span className="material-symbols-outlined">assignment</span>,
      available: talentoHumano,
    },
    {
      id: '/solicitudesTL',
      label: <span className="font-semibold text-[15px]">Solicitudes de Equipos</span>,
      icon: <span className="material-symbols-outlined">article_person</span>,
      available: leader,
    },
    {
      id: '/configuracion',
      label: <span className="font-semibold text-[15px]">Configuracion</span>,
      icon: <span className="material-symbols-outlined">settings</span>,
      available: true,
    },
  ].filter((o) => o.available)

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className="
        bg-white/60 dark:bg-gray-900/70 w-64 shadow-xl border-r border-gray-200 dark:border-gray-800 flex flex-col
        backdrop-blur-xs bg-white text-black
        dark:bg-[linear-gradient(270deg,rgba(11,14,94,0.9),rgba(0,1,37,0.8)80%)] dark:text-gray-200"
        style={{
          WebkitBackdropFilter: 'blur(10px)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Perfil compacto */}
        <div className="p-6 border-b-2 border-black dark:border-gray-800 shrink-0">
          <NavLink
            to="/profile"
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-24 h-20 rounded-full flex items-center justify-center overflow-hidden">
              {user?.urlPerfil ? (
                <img
                  src={`data:image/png;base64,${user.urlPerfil}`}
                  alt={user?.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-black dark:text-white font-bold text-lg">
                  <span className="material-symbols-outlined">account_circle</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-black dark:text-gray-100 line-clamp-1">
                {user?.nombre}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-400">{user?.rol?.nombre}</p>
            </div>
          </NavLink>
        </div>

        {/* Menú con scroll */}
        <nav
          className="flex-1 overflow-y-auto mt-6 custom-scrollbar"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgb(209 213 219) transparent' }}
        >
          {menuOptions.map((opt) => (
            <NavLink
              key={opt.id}
              to={opt.id}
              end={opt.end}
              className={({ isActive }) =>
                [
                  'w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors',
                  isActive
                    ? 'bg-[#ECB22E] text-white border-r-2 border-[#ECB22E]'
                    : 'text-black hover:text-blue-500 dark:text-gray-200 dark:hover:text-[#ECB22E]',
                ].join(' ')
              }
            >
              <span className="text-xl">{opt.icon}</span>
              <span className="font-medium">{opt.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <span className="font-semibold text-[15px]">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  )
}
