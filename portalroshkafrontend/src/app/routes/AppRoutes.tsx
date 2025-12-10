// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router'

import ProtectedRoute from '../../shared/ui/components/ProtectedRoute.tsx'
import DashboardLayout from '../../layouts/DashboardLayout'

// features públicas
import LoginPage from '../../features/auth/pages/LoginPage'
// import ChangePasswordPage from "../features/ChangePasswordPage";

// features privadas (home, perfil, etc.)
import HomePage from '../../features/home/pages/HomePage'
import ProfilePage from '../../features/mi-perfil/pages/ProfilePage.tsx'
import BeneficiosPage from '../../features/solicitudes/pages/BenefitsPage.tsx'
import UsuariosPage from '../../features/user/pages/UserPage.tsx'
import Configuration from '../../features/auth/pages/Configuration.tsx'

// Solicitudes (genéricas)
import RequestPage from '../../features/solicitudes/pages/RequestPage.tsx'
import RequestFormPage from '../../features/solicitudes/pages/RequestFormPage.tsx'
import BeneficioFormPage from '../../features/solicitudes/pages/BenefitsFormPage.tsx'
import RequestManagementPage from '../../features/solicitudes/pages/RequestManagementPage.tsx'
import RequestSearchPage from '../../features/solicitudes/pages/RequestSearchPage.tsx'
import DevicePage from '../../features/dispositivos/pages/DevicePage.tsx'
import DeviceFormPage from '../../features/dispositivos/pages/DeviceFormPage.tsx'
import SolicitudDispositivoPage from '../../features/dispositivos/pages/SolicitudDispositivoPage.tsx'
//import SolicitudDispositivoFormPage from "../features/dispositivos/SolicitudDispositivoFormPage.tsx";

// pagina de novedades
import NovedadesPage from "../../features/novedades/page/NovedadesPage.tsx";
import UserFormPage from '../../features/user/pages/UserFormPage.tsx'
import UserSearchPage from '../../features/user/pages/UserSearchPage.tsx'
import DeviceAssignmentFormPage from '../../features/dispositivos/pages/DeviceAssignmentFormPage'
import GestionDispositivosPage from '../../features/dispositivos/pages/GestionDispositivosPage'
import TipoDispositivoPage from '../../features/dispositivos/pages/TipoDispositivoPage'
import UbicacionPage from '../../features/ubicaciones/pages/UbicacionPage.tsx'
import ClientesPage from '../../features/clientes/pages/ClientesPage'
import CargosPage from '../../features/cargos/pages/CargosPage.tsx'
import RolesPage from '../../features/roles/pages/RolesPage'
import GestionTHPage from '../../features/tecnologias/pages/CatalogoTHPage.tsx'
import CatalogoOperacionesPage from '../../features/ubicaciones/pages/CatalogoSysPage.tsx'
import CatalogoOpPage from '../../features/clientes/pages/CatalogoOp.tsx'
import EquipoFormPage from '../../features/operations/EquipoFormPage'
import OperationsPage from '../../features/operations/OperationsPage'
import EditarEquipoPage from '../../features/operations/EditarEquipoPage'
import RequestViewPageUsuario from '../../features/solicitudes/pages/RequestViewPageUsuario.tsx'
import RequestViewTL from '../../features/solicitudes/pages/RequestViewTL.tsx'
import RequestViewPage from '../../features/solicitudes/pages/RequestViewPage.tsx'
import RequestTLPage from '../../features/solicitudes/pages/RequestTLPage.tsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />

      {/* if usuario ChangePassword = true  -FER*/}
      {/* <Route path="/cambiar-contraseña" element={<ChangePasswordPage />} /> */}

      {/* Rutas privadas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<HomePage />} />

          {/* Solicitudes */}
          {/*Solicitudes-Usuario*/}
          <Route path="/requests" element={<RequestPage />} />
          <Route path="/requests/beneficio" element={<RequestFormPage />} />
          <Route path="/requests/permiso" element={<RequestFormPage />} />
          <Route path="/request/vacaciones" element={<RequestFormPage />} />
          <Route path="/requests/:id" element={<RequestViewPageUsuario />} />

          {/*Solicitudes-Team Leader*/}
          <Route path="/solicitudesTL" element={<RequestTLPage />} />
          <Route path="/solicitudesTL/:id/ver" element={<RequestViewTL />} />
          <Route path="/solicitudesTL/:id/evaluar" element={<RequestViewTL />} />

          {/*Solicitudes-Talento Humano*/}
          <Route path="/seleccion-solicitudesTH" element={<RequestSearchPage />} />
          <Route path="/solicitudesTH/permisos" element={<RequestManagementPage />} />
          <Route path="/solicitudesTH/beneficios" element={<RequestManagementPage />} />
          <Route path="/solicitudesTH/vacaciones" element={<RequestManagementPage />} />
          <Route path="/solicitudesTH/:id/ver" element={<RequestViewPage />} />
          <Route path="/solicitudesTH/:id/evaluar" element={<RequestViewPage />} />

          {/* CREACION DE LAS NOVEDADES (para TH) */}
          <Route path="/crear-novedadesTH" element={<NovedadesPage />} />
          {/* Usuarios */}
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/usuarios/buscar" element={<UserSearchPage />} />
          <Route path="/usuarios/nuevo" element={<UserFormPage />} />
          <Route path="/usuarios/:id" element={<UserFormPage />} />

          {/* Operations */}
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/equipo/nuevo" element={<EquipoFormPage />} />
          <Route path="/equipo/:id/edit" element={<EditarEquipoPage />} />

          {/* Beneficios */}
          <Route path="/benefits" element={<BeneficiosPage />} />
          <Route path="/beneficios/nuevo" element={<BeneficioFormPage />} />

          {/* Dispositivos */}
          <Route path="/dispositivos" element={<DevicePage />} />
          <Route path="/dispositivos/nuevo" element={<DeviceFormPage />} />
          <Route path="/dispositivos/:id" element={<DeviceFormPage />} />

          {/* Solicitud de Dispositivos (usuarios) */}
          <Route path="/solicitud-dispositivo" element={<SolicitudDispositivoPage />} />

          {/* Gestión de Dispositivos (SYSADMIN) */}
          <Route path="/gestion-dispositivos" element={<GestionDispositivosPage />} />

          {/* Asignaciones de Dispositivos */}
          <Route path="/dispositivos-asignados/nuevo" element={<DeviceAssignmentFormPage />} />
          <Route path="/dispositivos-asignados/:id" element={<DeviceAssignmentFormPage />} />

          {/* Tipos de Dispositivo */}
          <Route path="/tipo-dispositivo" element={<TipoDispositivoPage />} />

          {/* Clientes */}
          <Route path="/clientes" element={<ClientesPage />} />

          {/* Cargos */}
          <Route path="/cargos" element={<CargosPage />} />

          {/* Roles */}
          <Route path="/roles" element={<RolesPage />} />

          {/* GestionTH */}
          <Route path="/catalogo-th" element={<GestionTHPage />} />

          {/* Ubicación */}
          <Route path="/ubicacion" element={<UbicacionPage />} />

          {/* declarar ruta para th y admin */}

          {/* CatalogoSysAdmin */}
          <Route path="/catalogo-sys" element={<CatalogoOperacionesPage />} />

          {/* CatalogoOperaciones */}
          <Route path="/catalogo-op" element={<CatalogoOpPage />} />

          {/* Configuración */}
          <Route path="/configuracion" element={<Configuration />} />

          {/* Perfil */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback simple para evitar loops */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
