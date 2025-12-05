package com.backend.portalroshkabackend.Services.Operations.Service;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoDTO;
import com.backend.portalroshkabackend.Models.HistorialTrabajo;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.HistorialTrabajoRepository;
import com.backend.portalroshkabackend.Repositories.ProyectoRepository;
import com.backend.portalroshkabackend.Services.Operations.Interface.IProyectoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProyectoServiceImpl implements IProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HistorialTrabajoRepository historialTrabajoRepository;
    @Override
    public ProyectoDTO crearProyecto(ProyectoDTO dto) {

        // Validar que el nombre no exista
        if (proyectoRepository.findByNombre(dto.getNombre()).isPresent()) {
            throw new RuntimeException("Ya existe un proyecto con este nombre.");
        }

        // Valida que el líder exista
        Usuario lider = usuarioRepository.findById(dto.getIdLiderEquipo())
                .orElseThrow(() -> new RuntimeException("El líder no existe."));



        // Crea el proyecto
        Proyecto p = dto.toEntity();
        p.setLiderEquipo(lider);

        if (p.getEstado() == null){
            p.setEstado(Proyecto.EstadoProyectoEnum.ACTIVO);
        }

        p = proyectoRepository.save(p);

        return ProyectoDTO.fromEntity(p);
    }

    @Override
    public ProyectoDTO obtenerProyectoPorId(Integer idProyecto) {
        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
        return ProyectoDTO.fromEntity(proyecto);
    }
    public List<ProyectoDTO> listarProyectos() {
        return proyectoRepository.findAll().stream()
                .map(ProyectoDTO::fromEntity)
                .collect(Collectors.toList());
    }
    @Override
    public ProyectoDTO actualizarProyecto(Integer id, ProyectoDTO dto) {

        Proyecto proyecto = proyectoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        Usuario lider = usuarioRepository.findById(dto.getIdLiderEquipo())
                .orElseThrow(() -> new RuntimeException("El líder no existe."));

        proyecto.setNombre(dto.getNombre());
        proyecto.setTecnologias(dto.getTecnologias());
        proyecto.setDescripcion(dto.getDescripcion());
        proyecto.setFechaInicio(dto.getFechaInicio());
        proyecto.setFechaLimite(dto.getFechaLimite());
        proyecto.setEstado(dto.getEstado());
        proyecto.setActivo(dto.getActivo());
        proyecto.setLiderEquipo(lider);

        proyectoRepository.save(proyecto);

        return ProyectoDTO.fromEntity(proyecto);
    }
    // para asignar nuevo miembro a un proyecto
    @Override
    public ProyectoDTO agregarAlEquipo(Integer idProyecto, List<Integer> usuarioId){

        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(()-> new RuntimeException("Proyecto no encontrado"));

        Set<Usuario> equipoActual = proyecto.getEquipoAsignado();

        for(Integer idUsuario : usuarioId){

            Usuario usuario = usuarioRepository.findById(idUsuario)
                    .orElseThrow(()-> new RuntimeException(("Usuario no encontrado"+ idUsuario)));

            if(equipoActual.contains(usuario)){
                continue;
            }
                equipoActual.add(usuario);

            boolean existe = historialTrabajoRepository.existsByUsuario_IdUsuarioAndProyecto_IdProyecto
                    (idUsuario, idProyecto);
//condicion para no duplicar historial
            if(!existe){
                HistorialTrabajo historial = new HistorialTrabajo();
                historial.setUsuario(usuario);
                historial.setProyecto(proyecto);
                historial.setFechaInicio(LocalDate.now());
                historial.setDescripcion("Nuevo miembro asignado");
                historialTrabajoRepository.save(historial);
            }

        }
                proyectoRepository.save(proyecto);
            return ProyectoDTO.fromEntity(proyecto);
    }
    //para eliminar miembro de equipo
    @Transactional
    @Override
    public ProyectoDTO eliminarUsuarioEquipo(Integer idProyecto, List<Integer> usuarioIds) {

        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        Usuario lider = proyecto.getLiderEquipo();
        Set<Usuario> equipo = proyecto.getEquipoAsignado();

        for (Integer idUsuario : usuarioIds) {

            Usuario usuario = usuarioRepository.findById(idUsuario)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + idUsuario));

            // No permitir eliminar al líder
            if (usuario.getIdUsuario().equals(lider.getIdUsuario())) {
                continue;
            }

            // solo si pertenece al equipo se elimina
            if (equipo.contains(usuario)) {
                equipo.remove(usuario);

            }
        }

        proyectoRepository.save(proyecto);

        return ProyectoDTO.fromEntity(proyecto);
    }

    @Override
    public void eliminarProyecto(Integer idProyecto) {
        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        proyectoRepository.delete(proyecto);
    }


}
