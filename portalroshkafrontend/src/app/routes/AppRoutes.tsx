// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router'

import ProtectedRoute from '../../shared/ui/components/ProtectedRoute.tsx'
import DashboardLayout from '../../layouts/DashboardLayout'

// features públicas
import LoginPage from '../../features/auth/pages/LoginPage'

// features privadas
import HomePage from '../../features/home/pages/HomePage'
import ProfilePage from '../../features/mi-perfil/pages/ProfilePage.tsx'
import BeneficiosPage from '../../features/solicitudes/pages/BenefitsPage.tsx'
import UsuariosPage from '../../features/user/pages/UserPage.tsx'
import Configuration from '../../features/auth/pages/Configuration.tsx'

// Solicitudes
import RequestPage from '../../features/solicitudes/pages/RequestPage.tsx'
import RequestFormPage from '../../features/solicitudes/pages/RequestFormPage.tsx'
import BeneficioFormPage from '../../features/solicitudes/pages/BenefitsFormPage.tsx'
import RequestManagementPage from '../../features/solicitudes/pages/RequestManagementPage.tsx'
import RequestSearchPage from '../../features/solicitudes/pages/RequestSearchPage.tsx'
import DevicePage from '../../features/dispositivos/pages/DevicePage.tsx'
import DeviceFormPage from '../../features/dispositivos/pages/DeviceFormPage.tsx'
import SolicitudDispositivoPage from '../../features/dispositivos/pages/SolicitudDispositivoPage.tsx'

// novedades
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

//import EquipoFormPage from '../../features/operations/EquipoFormPage'
//import EditarEquipoPage from '../../features/operations/EditarEquipoPage'

import RequestViewPageUsuario from '../../features/solicitudes/pages/RequestViewPageUsuario.tsx'
import RequestViewTL from '../../features/solicitudes/pages/RequestViewTL.tsx'
import RequestViewPage from '../../features/solicitudes/pages/RequestViewPage.tsx'
import RequestTLPage from '../../features/solicitudes/pages/RequestTLPage.tsx'

/* -----------------------------------------
   IMPORTS NUEVOS PARA EQUIPOS Y PROYECTOS
------------------------------------------ */
// Operaciones – Equipos (rutas reales)
import EquiposPage from '../../features/operations/equipos/EquiposPage'
import EquipoFormPageOps from '../../features/operations/equipos/EquipoFormPage'
import EditarEquipoPageOps from '../../features/operations/equipos/EditarEquipoPage'

// Operaciones – Proyectos
import ProyectosPage from '../../features/operations/proyectos/ProyectosPage'
import ProyectoFormPage from '../../features/operations/proyectos/ProyectoFormPage'

//Mi equipo / Mi proyecto 

import MiEquipoPage from '../../features/me-equipo/MiEquipoPage'
import MiProyectoPage from '@/features/me-proyecto/MiProyectoPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          <Route index element={<HomePage />} />

          {/* Solicitudes */}
          <Route path="/requests" element={<RequestPage />} />
          <Route path="/requests/beneficio" element={<RequestFormPage />} />
          <Route path="/requests/permiso" element={<RequestFormPage />} />
          <Route path="/request/vacaciones" element={<RequestFormPage />} />
          <Route path="/requests/:id" element={<RequestViewPageUsuario />} />

          {/* TL */}
          <Route path="/solicitudesTL" element={<RequestTLPage />} />
          <Route path="/solicitudesTL/:id/ver" element={<RequestViewTL />} />
          <Route path="/solicitudesTL/:id/evaluar" element={<RequestViewTL />} />

          {/* TH */}
          <Route path="/seleccion-solicitudesTH" element={<RequestSearchPage />} />
          <Route path="/solicitudesTH/permisos" element={<RequestManagementPage />} />
          <Route path="/solicitudesTH/beneficios" element={<RequestManagementPage />} />
          <Route path="/solicitudesTH/vacaciones" element={<RequestManagementPage />} />
          <Route path="/solicitudesTH/:id/ver" element={<RequestViewPage />} />
          <Route path="/solicitudesTH/:id/evaluar" element={<RequestViewPage />} />

          <Route path="/crear-novedadesTH" element={<NovedadesPage />} />

          {/* Usuarios */}
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/usuarios/buscar" element={<UserSearchPage />} />
          <Route path="/usuarios/nuevo" element={<UserFormPage />} />
          <Route path="/usuarios/:id" element={<UserFormPage />} />

        

          <Route path="/operations/equipos" element={<EquiposPage />} />
          <Route path="/operations/equipos/nuevo" element={<EquipoFormPageOps />} />
          <Route path="/operations/equipos/:id/edit" element={<EditarEquipoPageOps />} />

          {/*Mi equipo Mi proyecto*/ }

          <Route path="/mi-equipo" element={<MiEquipoPage />} />
          <Route path="/mi-proyecto" element={<MiProyectoPage />} />

          <Route path="/operations/proyectos" element={<ProyectosPage />} />
          <Route path="/operations/proyectos/nuevo" element={<ProyectoFormPage />} />
          <Route path="/operations/proyectos/:id/edit" element={<ProyectoFormPage />} />

          {/* Beneficios */}
          <Route path="/benefits" element={<BeneficiosPage />} />
          <Route path="/beneficios/nuevo" element={<BeneficioFormPage />} />

          {/* Dispositivos */}
          <Route path="/dispositivos" element={<DevicePage />} />
          <Route path="/dispositivos/nuevo" element={<DeviceFormPage />} />
          <Route path="/dispositivos/:id" element={<DeviceFormPage />} />

          <Route path="/solicitud-dispositivo" element={<SolicitudDispositivoPage />} />

          <Route path="/gestion-dispositivos" element={<GestionDispositivosPage />} />

          <Route path="/dispositivos-asignados/nuevo" element={<DeviceAssignmentFormPage />} />
          <Route path="/dispositivos-asignados/:id" element={<DeviceAssignmentFormPage />} />

          <Route path="/tipo-dispositivo" element={<TipoDispositivoPage />} />

          <Route path="/clientes" element={<ClientesPage />} />

          <Route path="/cargos" element={<CargosPage />} />

          <Route path="/roles" element={<RolesPage />} />

          <Route path="/catalogo-th" element={<GestionTHPage />} />

          <Route path="/ubicacion" element={<UbicacionPage />} />
        

          <Route path="/catalogo-sys" element={<CatalogoOperacionesPage />} />
          <Route path="/catalogo-op" element={<CatalogoOpPage />} />

          <Route path="/configuracion" element={<Configuration />} />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
