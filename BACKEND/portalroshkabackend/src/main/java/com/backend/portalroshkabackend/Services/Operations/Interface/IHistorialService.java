package com.backend.portalroshkabackend.Services.Operations.Interface;

import com.backend.portalroshkabackend.DTO.Operationes.HistorialDTO;

import java.util.List;

public interface IHistorialService {

    HistorialDTO asignarUsuarioAProyecto(HistorialDTO dto);

    HistorialDTO obtenerHistorialPorId(Integer idHistorial);

    List<HistorialDTO> listarHistorialPorUsuario(Integer idUsuario);

    List<HistorialDTO> listarHistorialPorProyecto(Integer idProyecto);

    HistorialDTO actualizarHistorial(Integer idHistorial, HistorialDTO dto);

    void eliminarHistorial(Integer idHistorial);

}
