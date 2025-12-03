package com.backend.portalroshkabackend.Services.Operations.Service;

import com.backend.portalroshkabackend.DTO.Operationes.HistorialDTO;
import com.backend.portalroshkabackend.Models.HistorialTrabajo;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.HistorialTrabajoRepository;
import com.backend.portalroshkabackend.Repositories.ProyectoRepository;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import com.backend.portalroshkabackend.Services.Operations.Interface.IHistorialService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistorialServiceImpl implements IHistorialService {

    private final HistorialTrabajoRepository historialTrabajoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProyectoRepository proyectoRepository;



    // OBTENER HISTORIAL POR ID

    @Override
    public HistorialDTO obtenerHistorialPorId(Integer idHistorial) {

        HistorialTrabajo historial = historialTrabajoRepository.findById(idHistorial)
                .orElseThrow(() -> new RuntimeException("Historial no encontrado"));

        return HistorialDTO.fromEntity(historial);
    }



    // LISTAR POR USUARIO

    @Override
    public List<HistorialDTO> listarHistorialPorUsuario(Integer idUsuario) {

        return historialTrabajoRepository.findByUsuario_IdUsuario(idUsuario)
                .stream()
                .map(HistorialDTO::fromEntity)
                .collect(Collectors.toList());
    }



    // LISTAR POR PROYECTO

    @Override
    public List<HistorialDTO> listarHistorialPorProyecto(Integer idProyecto) {

        return historialTrabajoRepository.findByProyecto_IdProyecto(idProyecto)
                .stream()
                .map(HistorialDTO::fromEntity)
                .collect(Collectors.toList());
    }



    // ACTUALIZAR HISTORIAL

    @Override
    public HistorialDTO actualizarHistorial(Integer idHistorial, HistorialDTO dto) {

        HistorialTrabajo historial = historialTrabajoRepository.findById(idHistorial)
                .orElseThrow(() -> new RuntimeException("Historial no encontrado"));

        historial.setFechaInicio(dto.getFechaInicial());
        historial.setFechaLimite(dto.getFechaLimite());
        historial.setDescripcion(dto.getDescripcion());
        historial.setDisponibleParaNuevos(dto.getDisponibleParaNuevos());

        historialTrabajoRepository.save(historial);

        return HistorialDTO.fromEntity(historial);
    }



    // ELIMINAR HISTORIAL

    @Override
    public void eliminarHistorial(Integer idHistorial) {

        historialTrabajoRepository.deleteById(idHistorial);
    }



    // ASIGNAR USUARIO A PROYECTO (EL PRINCIPAL)

    @Override
    public HistorialDTO asignarUsuarioAProyecto(HistorialDTO dto) {

        Integer idUsuario = dto.getIdUsuario();
        Integer idProyecto = dto.getIdProyecto();

        // Validar duplicado
        if (historialTrabajoRepository
                .existsByUsuario_IdUsuarioAndProyecto_IdProyecto(idUsuario, idProyecto)) {
            throw new RuntimeException("El usuario ya está asignado a este proyecto.");
        }

        // Buscar usuario
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Buscar proyecto
        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        // Crear registro
        HistorialTrabajo historial = dto.toEntity(usuario, proyecto);

        historial = historialTrabajoRepository.save(historial);

        return HistorialDTO.fromEntity(historial);
    }
}
