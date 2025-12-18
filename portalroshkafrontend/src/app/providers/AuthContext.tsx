  import { createContext, useContext, useState, useEffect } from 'react'
  import type { ReactNode } from 'react'

  export type User = {
    id: number
    nombre: string
    apellido: string
    correo: string
    rol: {
      idRol: number
      nombre: string
    } | null
    cargo?: { idCargo: number; nombre: string }
    equipos?: { idEquipo: number; nombre: string }[]
    diasVacaciones?: number
    diasVacacionesRestante?: number
    telefono?: string
    fechaIngreso?: string
    nroCedula?: string
    estado?: string
    requiereCambioContrasena?: boolean
    urlPerfil?: string
  }

  type AuthContextType = {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (token: string) => void
    logout: () => void
    refreshUser: () => void
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined)

  /* ===============================
    HELPERS
  ================================ */

  // Decodificar JWT
  function parseJwt(token: string): any {
    try {
      const base = token.split('.')[1]
      const json = decodeURIComponent(
        atob(base)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(json)
    } catch {
      return {}
    }
  }

  // Mapear ID de rol → nombre (CLAVE DEL PROBLEMA)
  function mapRolNombre(idRol: number): string {
    switch (idRol) {
      case 1:
        return 'TALENTO_HUMANO'
      case 2:
        return 'OPERACIONES'
      case 3:
        return 'ADMINISTRADOR_DEL_SISTEMA'
      case 4:
        return 'DESARROLLO'
      case 5:
        return 'DIRECTIVO'
      case 6:
        return 'TEAM_LEADER'
      default:
        return ''
    }
  }

  /* ===============================
    PROVIDER
  ================================ */

  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        setToken(storedToken)
        decodeAndSetUser(storedToken)
      }
    }, [])

    const decodeAndSetUser = async (jwtToken: string) => {
      try {
        const payload = parseJwt(jwtToken)

        // 🔑 el rol viene como NÚMERO desde el backend
        const rolId =
          typeof payload.rol === 'number'
            ? payload.rol
            : payload.rol?.idRol ?? null

        // Usuario básico desde el token
        const basicUser: User = {
          id: payload.id ?? 0,
          nombre: payload.nombre ?? '',
          apellido: payload.apellido ?? '',
          correo: payload.email ?? payload.sub ?? '',
          rol: rolId
            ? {
                idRol: rolId,
                nombre: mapRolNombre(rolId),
              }
            : null,
        }

        setUser(basicUser)

        // 🔄 Traer usuario completo del backend
        const res = await fetch('http://localhost:8080/api/v1/usuarios/me', {
          headers: { Authorization: `Bearer ${jwtToken}` },
        })

        if (!res.ok) throw new Error('No se pudo obtener datos completos del usuario')

        const fullUser: User = await res.json()

        setUser({
          ...fullUser,
          rol: fullUser.rol
            ? {
                idRol: fullUser.rol.idRol,
                nombre: mapRolNombre(fullUser.rol.idRol), // 🔑 CLAVE
              }
            : null,
        })

      } catch (e) {
        console.error('Error al decodificar el token:', e)
        setUser(null)
      }
    }

    const login = (jwtToken: string) => {
      localStorage.setItem('auth_token', jwtToken)
      setToken(jwtToken)
      decodeAndSetUser(jwtToken)
    }

    const logout = () => {
      localStorage.removeItem('auth_token')
      setUser(null)
      setToken(null)
    }

    const refreshUser = () => {
      if (token) decodeAndSetUser(token)
    }

    return (
      <AuthContext.Provider
        value={{
          user,
          token,
          isAuthenticated: !!token,
          login,
          logout,
          refreshUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  }

  /* ===============================
    HOOK
  ================================ */

  export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
      throw new Error('useAuth debe usarse dentro de un AuthProvider')
    }
    return context
  }
