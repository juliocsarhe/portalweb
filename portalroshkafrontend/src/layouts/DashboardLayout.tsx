import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../app/providers/AuthContext'
import { Roles } from '../types/roles'
import '../shared/ui/styles/scrollbar.css'
import { useState } from 'react'
import { tieneRol } from '../shared/utils/permisos'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  // directivo puede ver todo
const disponiblePara = (...roles: Roles[]) => {
  return tieneRol(user, Roles.DIRECTIVO, ...roles)
}

const menuOptions = [
  {
    id: '/',
    label: <span className="font-semibold text-[15px]">Inicio</span>,
    icon: <span className="material-symbols-outlined">home</span>,
    available: true,
  },

  {
    id: 'gestiones',
    label: <span className="font-semibold text-[15px]">Gestiones</span>,
    icon: <span className="material-symbols-outlined">folder</span>,
    available: true,
    children: [
      {
        id: '/solicitudesTH/permisos',
        label: <span className="font-semibold text-[14px]">Ver Permisos</span>,
        available: true,
      },
      {
        id: '/solicitudesTH/beneficios',
        label: <span className="font-semibold text-[14px]">Ver Beneficios</span>,
        available: true,
      },
      {
        id: '/solicitudesTH/vacaciones',
        label: <span className="font-semibold text-[14px]">Ver Vacaciones</span>,
        available: true,
      },
      {
        id: '/solicitudesTL',
        label: (
          <span className="font-semibold text-[14px]">Solicitudes de Equipo</span>
        ),
        available: disponiblePara(Roles.TEAM_LEADER),
      },
    ],
  },

  {
    id: 'solicitudes',
    label: <span className="font-semibold text-[15px]">Solicitudes</span>,
    icon: <span className="material-symbols-outlined">list_alt</span>,
    available: true,
    children: [
      {
        id: '/requests',
        label: <span className="font-semibold text-[14px]">Mis Solicitudes</span>,
        available: true,
      },
      {
        id: '/request/vacaciones',
        label: (
          <span className="font-semibold text-[14px]">Solicitar Vacaciones</span>
        ),
        available: true,
      },
      {
        id: '/requests/beneficio',
        label: (
          <span className="font-semibold text-[14px]">Solicitar Beneficios</span>
        ),
        available: true,
      },
      {
        id: '/requests/permiso',
        label: (
          <span className="font-semibold text-[14px]">Solicitar Permisos</span>
        ),
        available: true,
      },
    ],
  },

  {
    id: 'dispositivos',
    label: <span className="font-semibold text-[15px]">Dispositivos</span>,
    icon: <span className="material-symbols-outlined">devices</span>,
    available: true,
    children: [
      {
        id: '/solicitud-dispositivo',
        label: (
          <span className="font-semibold text-[14px]">
            Solicitar Dispositivo
          </span>
        ),
        available: true,
      },
      {
        id: '/dispositivos',
        label: (
          <span className="font-semibold text-[14px]">Ver Dispositivos</span>
        ),
        available: disponiblePara(Roles.ADMINISTRADOR_DEL_SISTEMA),
      },
      {
        id: '/catalogo-sys',
        label: (
          <span className="font-semibold text-[14px]">
            Tipos de Dispositivos y Ubicaciones
          </span>
        ),
        available: disponiblePara(Roles.ADMINISTRADOR_DEL_SISTEMA),
      },
      {
        id: '/gestion-dispositivos',
        label: (
          <span className="font-semibold text-[14px]">
            Gestión de Dispositivos
          </span>
        ),
        available: disponiblePara(Roles.ADMINISTRADOR_DEL_SISTEMA),
      },
    ],
  },

  {
    id: '/catalogo-th',
    label: <span className="font-semibold text-[15px]">Cargos y Roles</span>,
    icon: <span className="material-symbols-outlined">groups</span>,
    available: disponiblePara(Roles.TALENTO_HUMANO),
  },
  {
    id: '/usuarios',
    label: <span className="font-semibold text-[15px]">Funcionarios</span>,
    icon: <span className="material-symbols-outlined">groups</span>,
    available: disponiblePara(Roles.TALENTO_HUMANO),
  },

  {
    id: '/catalogo-op',
    label: (
      <span className="font-semibold text-[15px]">
        Clientes y Tecnologías
      </span>
    ),
    icon: <span className="material-symbols-outlined">apartment</span>,
    available: disponiblePara(Roles.OPERACIONES),
  },
  {
    id: '/operations',
    label: (
      <span className="font-semibold text-[15px]">Gestión de Equipos</span>
    ),
    icon: <span className="material-symbols-outlined">engineering</span>,
    available: disponiblePara(Roles.OPERACIONES),
  },

  {
    id: '/benefits',
    label: <span className="font-semibold text-[15px]">Beneficios</span>,
    icon: <span className="material-symbols-outlined">redeem</span>,
    available: true,
  },

  {
    id: '/crear-novedadesTH',
    label: <span className="font-semibold text-[15px]">Crear Novedades</span>,
    icon: <span className="material-symbols-outlined">newspaper</span>,
    available: disponiblePara(
      Roles.ADMINISTRADOR_DEL_SISTEMA,
      Roles.TALENTO_HUMANO
    ),
  },
].filter((opt) => opt.available)


  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden">
      <aside
        className="w-64 shadow-xl border-r border-gray-200 dark:border-gray-800 flex flex-col
                   bg-white/70 dark:bg-gray-900/70 backdrop-blur-xs
                   dark:bg-[linear-gradient(270deg,rgba(11,14,94,0.9),rgba(0,1,37,0.8)80%)]
                   text-black dark:text-gray-200"
        style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)' }}
      >
        {/* Perfil */}
        <div className="p-6 border-b-2 border-black dark:border-gray-800 shrink-0">
          <NavLink to="/profile" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition">
            <div className="w-24 h-20 rounded-full overflow-hidden flex items-center justify-center">
              {user?.urlPerfil ? (
                <img src={`data:image/png;base64,${user.urlPerfil}`} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-6xl text-white">account_circle</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-black dark:text-gray-100 line-clamp-1">{user?.nombre}</p>
              <p className="text-sm text-gray-700 dark:text-gray-400">{user?.rol?.nombre}</p>
            </div>
          </NavLink>
        </div>

        {/* Menú */}
        <nav className="flex-1 overflow-y-auto mt-6 custom-scrollbar">
          {menuOptions.map((opt) =>
            opt.children ? (
              <div key={opt.id} className="flex flex-col">
                <button
                  onClick={() => setOpenMenu(openMenu === opt.id ? null : opt.id)}
                  className="w-full text-left px-6 py-3 flex items-center justify-between
                             text-black hover:text-blue-500 dark:text-gray-200 dark:hover:text-[#ECB22E]"
                >
                  <span className="flex items-center space-x-3">
                    {opt.icon && <span className="text-xl">{opt.icon}</span>}
                    <span className="font-medium">{opt.label}</span>
                  </span>
                  <span className="material-symbols-outlined">
                    {openMenu === opt.id ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {openMenu === opt.id &&
                  opt.children.map((child) => child.available && (
                    <NavLink
                      key={child.id}
                      to={child.id}
                      className={({ isActive }) =>
                        [
                          'w-full text-left px-12 py-2 flex items-center space-x-3 transition-colors text-sm',
                          isActive
                            ? 'bg-[#ECB22E] text-white border-r-2 border-[#ECB22E]'
                            : 'text-black hover:text-blue-500 dark:text-gray-200 dark:hover:text-[#ECB22E]',
                        ].join(' ')
                      }
                    >
                      <span className="font-medium">{child.label}</span>
                    </NavLink>
                  ))}
              </div>
            ) : (
              <NavLink
                key={opt.id}
                to={opt.id}
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
            )
          )}
        </nav>

        {/* Configuración + Logout */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <NavLink
            to="/configuracion"
            className="w-full flex items-center justify-between px-4 py-2 text-black dark:text-white hover:text-blue-500 dark:hover:text-[#ECB22E]"
          >
            <span className="font-semibold text-[15px]">Configuración</span>
            <span className="material-symbols-outlined">settings</span>
          </NavLink>

          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-400 mt-3"
          >
            <span className="font-semibold text-[15px]">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  )
}
