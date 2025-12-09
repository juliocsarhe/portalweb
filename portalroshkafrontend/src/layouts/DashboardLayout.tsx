import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../app/providers/AuthContext'
import { Roles } from '../types/roles'
import { useState } from 'react'
import { tieneRol } from '../shared/utils/permisos'
import '../shared/ui/styles/scrollbar.css'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  // Función para simplificar la comprobación de roles
  const disponiblePara = (...roles: Roles[]) => tieneRol(user, ...roles)

  const menuOptions = [
    {
      id: '/',
      label: 'Inicio',
      icon: 'home',
      available: true,
    },
    {
      id: 'gestiones',
      label: 'Gestiones',
      icon: 'folder',
      available: true,
      children: [
        { id: '/requests', label: 'Solicitudes', available: true },
        { id: '/solicitudesTH/permisos', label: 'Ver Permisos', available: true },
        { id: '/solicitudesTH/beneficios', label: 'Ver Beneficios', available: true },
        { id: '/solicitudesTH/vacaciones', label: 'Ver Vacaciones', available: true },
        { id: '/solicitudesTL', label: 'Solicitudes de Equipo', available: disponiblePara(Roles.TEAM_LEADER) },
      ],
    },
    {
      id: 'dispositivos',
      label: 'Dispositivos',
      icon: 'devices',
      available: true,
      children: [
        { id: '/solicitud-dispositivo', label: 'Solicitar Dispositivo', available: true },
        { id: '/dispositivos', label: 'Ver Dispositivos', available: disponiblePara(Roles.ADMINISTRADOR_DEL_SISTEMA) },
        { id: '/catalogo-sys', label: 'Tipos de Dispositivos y Ubicaciones', available: disponiblePara(Roles.ADMINISTRADOR_DEL_SISTEMA) },
        { id: '/gestion-dispositivos', label: 'Gestión de Dispositivos', available: disponiblePara(Roles.ADMINISTRADOR_DEL_SISTEMA) },
      ],
    },
    { id: '/catalogo-th', label: 'Cargos y Roles', icon: 'groups', available: disponiblePara(Roles.TALENTO_HUMANO) },
    { id: '/usuarios', label: 'Funcionarios', icon: 'groups', available: disponiblePara(Roles.TALENTO_HUMANO) },
    { id: '/catalogo-op', label: 'Clientes y Tecnologías', icon: 'apartment', available: disponiblePara(Roles.OPERACIONES) },
    { id: '/operations', label: 'Gestión de Equipos', icon: 'engineering', available: disponiblePara(Roles.OPERACIONES) },
    { id: '/benefits', label: 'Beneficios', icon: 'redeem', available: true },
    { id: '/crear-novedadesTH', label: 'Crear Novedades', icon: 'newspaper', available: disponiblePara(Roles.ADMINISTRADOR_DEL_SISTEMA, Roles.TALENTO_HUMANO) },
  ].filter((opt) => opt.available)

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-950">
      <aside className="w-64 flex flex-col bg-white/70 dark:bg-gray-900/70 shadow-xl border-r border-gray-200 dark:border-gray-800 backdrop-blur-xs text-black dark:text-gray-200" style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)' }}>
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
          {menuOptions.map((opt) => (
            <div key={opt.id} className="flex flex-col">
              {opt.children ? (
                <>
                  <button
                    onClick={() => setOpenMenu(openMenu === opt.id ? null : opt.id)}
                    className="w-full text-left px-6 py-3 flex items-center justify-between text-black hover:text-blue-500 dark:text-gray-200 dark:hover:text-[#ECB22E]"
                  >
                    <span className="flex items-center space-x-3">
                      {opt.icon && <span className="text-xl material-symbols-outlined">{opt.icon}</span>}
                      <span className="font-medium">{opt.label}</span>
                    </span>
                    <span className="material-symbols-outlined">{openMenu === opt.id ? 'expand_less' : 'expand_more'}</span>
                  </button>
                  {openMenu === opt.id &&
                    opt.children
                      .filter((child) => child.available) // ✅ Filtra los hijos visibles
                      .map((child) => (
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
                </>
              ) : (
                <NavLink
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
                  {opt.icon && <span className="text-xl material-symbols-outlined">{opt.icon}</span>}
                  <span className="font-medium">{opt.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* Config + Logout */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <NavLink to="/configuracion" className="w-full flex items-center justify-between px-4 py-2 text-black dark:text-white hover:text-blue-500 dark:hover:text-[#ECB22E]">
            <span className="font-semibold text-[15px]">Configuración</span>
            <span className="material-symbols-outlined">settings</span>
          </NavLink>

          <button onClick={logout} className="w-full flex items-center px-4 py-2 text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-400 mt-3">
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
