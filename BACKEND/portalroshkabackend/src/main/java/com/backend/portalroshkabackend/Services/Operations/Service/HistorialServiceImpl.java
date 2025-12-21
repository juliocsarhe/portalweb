package com.backend.portalroshkabackend.Services.Operations.Service;


import com.backend.portalroshkabackend.DTO.Operationes.HistorialResponseDTO;
import com.backend.portalroshkabackend.DTO.common.HistorialPerfilResponseDTO;
import com.backend.portalroshkabackend.Models.HistorialTrabajo;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.HistorialTrabajoRepository;
import com.backend.portalroshkabackend.Services.Operations.Interface.IHistorialService;
import com.backend.portalroshkabackend.tools.mapper.HistorialTrabajoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class HistorialServiceImpl implements IHistorialService {

    private final HistorialTrabajoRepository historialRepository;
    private final HistorialTrabajoMapper historialMapper;

    @Override
        public List<HistorialResponseDTO> listarHistorialPorUsuario(Integer idUsuario){
         return historialRepository.findByUsuario_IdUsuarioOrderByFechaInicioDesc(idUsuario).stream()
                    .map(historialMapper::toDto).toList();
    }

    @Override
    public List<HistorialResponseDTO> listarHistorialPorProyecto(Integer idProyecto){
        return historialRepository.findByProyecto_IdProyectoOrderByFechaInicioDesc(idProyecto).stream()
                .map(historialMapper::toDto).toList();
    }

    @Override
    public HistorialResponseDTO obtenerHistorialPorId(Integer idHistorial){
        HistorialTrabajo historialTrabajo = historialRepository.findById(idHistorial)
                .orElseThrow(()-> new RuntimeException("Historial no encontrado"));
        return historialMapper.toDto(historialTrabajo);
    }

    public List<HistorialPerfilResponseDTO> listarHistorialPerfil(Integer idUsuario) {

        return historialRepository
                .findByUsuario_IdUsuarioOrderByFechaInicioDesc(idUsuario)
                .stream()
                .map(historialMapper::toPerfilDto)
                .toList();

    }

}
