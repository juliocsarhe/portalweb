package com.backend.portalroshkabackend.Services.Operations.Service;

import com.backend.portalroshkabackend.DTO.Operationes.HistorialDTO;
import com.backend.portalroshkabackend.DTO.common.UserDto;
import com.backend.portalroshkabackend.Models.HistorialTrabajo;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.HistorialTrabajoRepository;
import com.backend.portalroshkabackend.Repositories.ProyectoRepository;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import com.backend.portalroshkabackend.Services.Operations.Interface.IHistorialService;
import com.backend.portalroshkabackend.Services.UsuariosService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistorialServiceImpl implements IHistorialService {

    private final HistorialTrabajoRepository historialTrabajoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProyectoRepository proyectoRepository;
    private final UsuariosService usuariosService;



    private boolean esTalentoHumano(Usuario u) {
        return u.getRol().getNombre().equalsIgnoreCase("TALENTO HUMANO");
    }

    private boolean esOperaciones(Usuario u) {
        return u.getRol().getNombre().equalsIgnoreCase("OPERACIONES");
    }

    private boolean esDesarrollo(Usuario u) {
        return u.getRol().getNombre().equalsIgnoreCase("DESARROLLO");
    }

    private boolean esTeamLeader(Usuario u) {
        return u.getRol().getNombre().equalsIgnoreCase("TEAM_LEADER");
    }

    private boolean esAdmin(Usuario u) {
        return u.getRol().getNombre().equalsIgnoreCase("ADMINISTRADOR DEL SISTEMA");
    }

    private Usuario getUsuarioActualEntity() {
        UserDto user = usuariosService.getUsuarioActual();
        return usuarioRepository.findById(user.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario actual no encontrado"));
    }


    @Override
    public HistorialDTO obtenerHistorialPorId(Integer idHistorial) {

        Usuario actual = getUsuarioActualEntity();
        HistorialTrabajo historial = historialTrabajoRepository.findById(idHistorial)
                .orElseThrow(() -> new RuntimeException("Historial no encontrado"));

        Integer idUsuarioHistorial = historial.getUsuario().getIdUsuario();

        // Restricción para DESARROLLO
        if (esDesarrollo(actual) && !actual.getIdUsuario().equals(idUsuarioHistorial)) {
            throw new RuntimeException("No puedes ver historial de otros usuarios.");
        }

        // Restricción para TEAM LEADER
        if (esTeamLeader(actual)) {
            Proyecto proyecto = proyectoRepository.findByLiderEquipo(actual)
                    .orElseThrow(() -> new RuntimeException("No lideras ningún proyecto."));

            boolean pertenece = proyecto.getEquipos()
                    .getUsuarios().stream()
                    .anyMatch(u -> u.getIdUsuario().equals(idUsuarioHistorial));

            if (!pertenece && !actual.getIdUsuario().equals(idUsuarioHistorial)) {
                throw new RuntimeException("Solo puedes ver historial de usuarios de tu equipo.");
            }
        }

        return HistorialDTO.fromEntity(historial);
    }


    @Override
    public List<HistorialDTO> listarHistorialPorUsuario(Integer idUsuario) {

        Usuario actual = getUsuarioActualEntity();


        if (esDesarrollo(actual) && !actual.getIdUsuario().equals(idUsuario)) {
            throw new RuntimeException("No tienes permiso para ver historial de otros usuarios.");
        }


        if (esTeamLeader(actual)) {

            boolean autorizado = false;

            Optional<Proyecto> liderado = proyectoRepository.findByLiderEquipo(actual);

            if (liderado.isPresent()) {
                boolean pertenecePorLiderazgo = liderado.get()
                        .getEquipos()
                        .getUsuarios()
                        .stream()
                        .anyMatch(u -> u.getIdUsuario().equals(idUsuario));

                if (pertenecePorLiderazgo) autorizado = true;
            }

            List<Proyecto> misProyectos = proyectoRepository.findByEquipos_Usuarios_IdUsuario(actual.getIdUsuario());

            boolean perteneceComoMiembro = misProyectos.stream()
                    .flatMap(p -> p.getEquipos().getUsuarios().stream())
                    .anyMatch(u -> u.getIdUsuario().equals(idUsuario));

            if (perteneceComoMiembro) autorizado = true;

            if (actual.getIdUsuario().equals(idUsuario)) autorizado = true;

            if (!autorizado) {
                throw new RuntimeException("No puedes ver historial de este usuario.");
            }
        }

        return historialTrabajoRepository.findByUsuario_IdUsuario(idUsuario)
                .stream()
                .map(HistorialDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<HistorialDTO> listarHistorialPorProyecto(Integer idProyecto) {

        Usuario actual = getUsuarioActualEntity();

        // DESARROLLO → NO puede ver proyectos ajenos
        if (esDesarrollo(actual)) {
            throw new RuntimeException("No tienes permiso para ver historial por proyecto.");
        }

        // TEAM LEADER → SOLO su proyecto
        if (esTeamLeader(actual)) {
            Proyecto proyecto = proyectoRepository.findByLiderEquipo(actual)
                    .orElseThrow(() -> new RuntimeException("No lideras ningún proyecto."));

            if (!proyecto.getIdProyecto().equals(idProyecto)) {
                throw new RuntimeException("No puedes ver proyectos que no lideras.");
            }
        }

        return historialTrabajoRepository.findByProyecto_IdProyecto(idProyecto)
                .stream()
                .map(HistorialDTO::fromEntity)
                .collect(Collectors.toList());
    }


    @Override
    public HistorialDTO actualizarHistorial(Integer idHistorial, HistorialDTO dto) {

        Usuario actual = getUsuarioActualEntity();

        if (!(esTalentoHumano(actual) || esAdmin(actual))) {
            throw new RuntimeException("No tienes permiso para editar historial.");
        }

        HistorialTrabajo historial = historialTrabajoRepository.findById(idHistorial)
                .orElseThrow(() -> new RuntimeException("Historial no encontrado"));

        historial.setFechaInicio(dto.getFechaInicial());
        historial.setFechaLimite(dto.getFechaLimite());
        historial.setDescripcion(dto.getDescripcion());
        historial.setDisponibleParaNuevos(dto.getDisponibleParaNuevos());

        historialTrabajoRepository.save(historial);

        return HistorialDTO.fromEntity(historial);
    }


    @Override
    public void eliminarHistorial(Integer idHistorial) {

        Usuario actual = getUsuarioActualEntity();

        if (!esAdmin(actual)) {
            throw new RuntimeException("Solo el Administrador puede eliminar historial.");
        }

        historialTrabajoRepository.deleteById(idHistorial);
    }

            //Asigna usuario a proyecto
    @Override
    public HistorialDTO asignarUsuarioAProyecto(HistorialDTO dto) {

        Usuario actual = getUsuarioActualEntity();

        if (!(esOperaciones(actual) || esAdmin(actual))) {
            throw new RuntimeException("No tienes permiso para asignar usuarios a proyectos.");
        }

        Integer idUsuario = dto.getIdUsuario();
        Integer idProyecto = dto.getIdProyecto();

        // Validar duplicado
        if (historialTrabajoRepository.existsByUsuario_IdUsuarioAndProyecto_IdProyecto(idUsuario, idProyecto)) {
            throw new RuntimeException("El usuario ya está asignado a este proyecto.");
        }

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        HistorialTrabajo historial = dto.toEntity(usuario, proyecto);
        historial = historialTrabajoRepository.save(historial);

        return HistorialDTO.fromEntity(historial);
    }
}
