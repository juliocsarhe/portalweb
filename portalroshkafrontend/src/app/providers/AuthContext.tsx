import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export type User = {
  idUsuario: number
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
  userLoaded: boolean
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// decode JWT payload
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [userLoaded, setUserLoaded] = useState(false);

useEffect(() => {
  const storedToken = localStorage.getItem('auth_token')

  if (storedToken && storedToken.trim() !== '') {
    setToken(storedToken)
    decodeAndSetUser(storedToken)
  } else {
    setToken(null)
    setUser(null)
  }
}, [])


  const decodeAndSetUser = async (jwtToken: string) => {
    try {
      const payload = parseJwt(jwtToken)
      // tolerante a diferentes estructuras de rol
      let rol = null
      if (payload.rol) {
        if (typeof payload.rol === 'object') {
          rol = {
            idRol: payload.rol.idRol ?? 0,
            nombre: payload.rol.nombre ?? '',
          }
        } else if (typeof payload.rol === 'string') {
          rol = { idRol: 0, nombre: payload.rol }
        } else if (typeof payload.rol === 'number') {
          rol = { idRol: payload.rol, nombre: '' }
        }
      }
      const basicUser: User = {
        idUsuario: payload.idUsuario ?? undefined,
        nombre: payload.nombre ?? '',
        apellido: payload.apellido ?? '',
        correo: payload.email ?? payload.sub ?? '',
        rol: payload.rol
          ? {
              idRol: payload.rol.idRol ?? 0,
              nombre: payload.rol.nombre ?? '',
            }
          : null, // si no viene, null
      }
      setUser(basicUser)

      // Ahora pedimos los datos completos al backend
      const res = await fetch('http://localhost:8080/api/v1/usuarios/me', {
        headers: { Authorization: `Bearer ${jwtToken}` },
      })

      if (!res.ok) throw new Error('No se pudo obtener datos completos del usuario')

      const fullUser: User = await res.json()
      console.log('FULL USER BACKEND:', fullUser);
      const mappedUser: User = {
        ...fullUser,
        idUsuario: fullUser.idUsuario, 
      }
      
      setUser(mappedUser)
      setUserLoaded(true);
    } catch (e) {
      console.error('Error al decodificar el token:', e)
      setUser(null)
      setUserLoaded(true);
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
        userLoaded,
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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider')
  return context
}
