// // ProtectedRoute.tsx
// import { Navigate, Outlet, useLocation } from "react-router";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute() {
//   const { isAuthenticated, user } = useAuth();
//   const location = useLocation();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // 🚨 Forzar cambio de contraseña si aplica
//   if (user?.requiereCambioContrasena && location.pathname !== "/cambiar-contraseña") {
//     return <Navigate to="/cambiar-contraseña" replace />;
//   }

//   return <Outlet />;
// }
// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../../../app/providers/AuthContext'

export default function ProtectedRoute() {
  const { token, logout } = useAuth() // usa token o flag de sesión
  const location = useLocation()

  // No hay sesión
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Token inválido (extra seguridad)
  if (typeof token !== "string" || token.trim() === "") {
    logout()
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
