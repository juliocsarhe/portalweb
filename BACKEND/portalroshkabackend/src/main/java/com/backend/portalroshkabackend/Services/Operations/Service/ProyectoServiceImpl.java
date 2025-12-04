package com.backend.portalroshkabackend.Services.Operations.Service;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoDTO;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.ProyectoRepository;
import com.backend.portalroshkabackend.Services.Operations.Interface.IProyectoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProyectoServiceImpl implements IProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final UsuarioRepository usuarioRepository;
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

    @Override
    public void eliminarProyecto(Integer idProyecto) {
        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        proyectoRepository.delete(proyecto);
    }


}
