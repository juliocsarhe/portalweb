package com.backend.portalroshkabackend.Services.Operations.Interface;

import com.backend.portalroshkabackend.DTO.Operationes.HistorialDTO;
import com.backend.portalroshkabackend.DTO.Operationes.HistorialResponseDTO;

import java.util.List;

public interface IHistorialService {

    List<HistorialResponseDTO> listarHistorialPorUsuario(Integer idUsuario);

    List<HistorialResponseDTO> listarHistorialPorProyecto(Integer idProyecto);

    HistorialResponseDTO obtenerHistorialPorId(Integer idHistorial);


}
