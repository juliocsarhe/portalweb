package com.backend.portalroshkabackend.Services.Operations.Interface;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoDTO;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IProyectoService {

    ProyectoDTO crearProyecto(ProyectoDTO dto);

    ProyectoDTO obtenerProyectoPorId(Integer idProyecto);

    List<ProyectoDTO> listarProyectos();

    ProyectoDTO actualizarProyecto(Integer idProyecto, ProyectoDTO dto);

    // para asignar nuevo miembro a un proyecto
    ProyectoDTO agregarAlEquipo(Integer idProyecto, List<Integer> usuarioId);

    //para eliminar miembro de equipo
    @Transactional
    ProyectoDTO eliminarUsuarioEquipo(Integer idProyecto, List<Integer> usuarioIds);

    void eliminarProyecto(Integer idProyecto);




}
