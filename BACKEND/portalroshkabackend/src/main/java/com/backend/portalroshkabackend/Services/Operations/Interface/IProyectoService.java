package com.backend.portalroshkabackend.Services.Operations.Interface;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoRequestDto;
import com.backend.portalroshkabackend.DTO.Operationes.ProyectoResponseDto;

import java.util.List;

public interface IProyectoService {

    ProyectoResponseDto crearProyecto(ProyectoRequestDto proyectoRequestDto);

    ProyectoResponseDto obtenerProyectoPorId(Integer idProyecto);

    List<ProyectoResponseDto> listarProyectos();

    ProyectoResponseDto actualizarProyectos(Integer idProyecto, ProyectoRequestDto proyectoRequestDto);

    void eliminarProyecto(Integer idProyecto);

}
