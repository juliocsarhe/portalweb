package com.backend.portalroshkabackend.Services.Operations.Interface;

import com.backend.portalroshkabackend.DTO.Operationes.HistorialDTO;

import java.util.List;

public interface IHistorialService {
    HistorialDTO crearHistorial(HistorialDTO dto);

    HistorialDTO obtenerHistorialPorId(Long idHistorial);

    HistorialDTO asignarUsuarioAProyecto(HistorialDTO dto);

    List<HistorialDTO> listarHistorialPorUsuario(Long idUsuario);

    List<HistorialDTO> listarHistorialPorProyecto(Long idProyecto);

    HistorialDTO actualizarHistorial(Long idHistorial, HistorialDTO dto);

    void eliminarHistorial(Long idHistorial);

}
