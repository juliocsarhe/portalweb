package com.backend.portalroshkabackend.Services.Operations.Service;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoDTO;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Repositories.ProyectoRepository;
import com.backend.portalroshkabackend.Services.Operations.Interface.IProyectoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProyectoServiceImpl implements IProyectoService {

    private final ProyectoRepository proyectoRepository;

    @Override
    public ProyectoDTO crearProyecto(ProyectoDTO dto){

        // 1. Verificar si el nombre ya existe
        boolean existe = proyectoRepository
                .findByNombre(dto.getNombre())
                .isPresent();

        if (existe) {
            throw new RuntimeException("Ya existe un proyecto con este nombre.");
        }

        // 2. Crear proyecto si no existe
        Proyecto proyecto = dto.toEntity();

        proyecto = proyectoRepository.save(proyecto);

        return ProyectoDTO.fromEntity(proyecto);
    }
    @Override
    public ProyectoDTO obtenerProyectoPorId(Long idProyecto) {
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
    public ProyectoDTO actualizarProyecto(Long idProyecto, ProyectoDTO dto) {
        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        proyecto.setNombre(dto.getNombre());
        proyecto.setLiderEquipo(dto.getLiderEquipo());
        proyecto.setTecnologias(dto.getTecnologias());
        proyecto.setDescripcion(dto.getDescripcion());
        proyecto.setFechaInicio(dto.getFechaInicio());
        proyecto.setFechaLimite(dto.getFechaLimite());
        proyecto.setEstado(dto.getEstado());
        proyecto.setActivo(dto.getActivo());

        proyectoRepository.save(proyecto);

        return ProyectoDTO.fromEntity(proyecto);
    }

}
