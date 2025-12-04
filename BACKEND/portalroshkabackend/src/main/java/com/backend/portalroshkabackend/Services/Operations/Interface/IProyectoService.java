package com.backend.portalroshkabackend.Services.Operations.Interface;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoDTO;

import java.util.List;

public interface IProyectoService {

    ProyectoDTO crearProyecto(ProyectoDTO dto);

    ProyectoDTO obtenerProyectoPorId(Integer idProyecto);

    List<ProyectoDTO> listarProyectos();

    ProyectoDTO actualizarProyecto(Integer idProyecto, ProyectoDTO dto);

    void eliminarProyecto(Integer idProyecto);




}
