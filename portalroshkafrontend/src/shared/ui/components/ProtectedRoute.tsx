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
import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '../../../app/providers/AuthContext'

export default function ProtectedRoute() {
  const { token } = useAuth() // usa token o flag de sesión
  const location = useLocation()

  const isAllowed = !!token

  if (!isAllowed) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}
