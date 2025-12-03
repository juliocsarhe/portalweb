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

    @Override
    public HistorialDTO crearHistorial(HistorialDTO dto){

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Proyecto proyecto = proyectoRepository.findById(dto.getIdProyecto())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        HistorialTrabajo historial = dto.toEntity(usuario, proyecto);

        historial = historialTrabajoRepository.save(historial);

        return HistorialDTO.fromEntity(historial);
    }

    @Override
    public HistorialDTO obtenerHistorialPorId(Long idHistorial) {
        HistorialTrabajo historial = historialTrabajoRepository.findById(idHistorial.intValue())
                .orElseThrow(() -> new RuntimeException("Historial no encontrado"));

        return HistorialDTO.fromEntity(historial);
    }

    @Override
    public List<HistorialDTO> listarHistorialPorUsuario(Long idUsuario) {
        return historialTrabajoRepository.findByUsuario_IdUsuario(idUsuario.intValue())
                .stream()
                .map(HistorialDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<HistorialDTO> listarHistorialPorProyecto(Long idProyecto) {

        return historialTrabajoRepository.findByProyecto_IdProyecto(idProyecto.intValue())
                .stream()
                .map(HistorialDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public HistorialDTO actualizarHistorial(Long idHistorial, HistorialDTO dto) {

        HistorialTrabajo historial = historialTrabajoRepository.findById(idHistorial.intValue())
                .orElseThrow(() -> new RuntimeException("Historial no encontrado"));

        historial.setFechaInicio(dto.getFechaInicial());
        historial.setFechaLimite(dto.getFechaLimite());
        historial.setDescripcion(dto.getDescripcion());
        historial.setDisponibleParaNuevos(dto.getDisponibleParaNuevos());

        historialTrabajoRepository.save(historial);

        return HistorialDTO.fromEntity(historial);
    }

    @Override
    public void eliminarHistorial(Long idHistorial) {
        historialTrabajoRepository.deleteById(idHistorial.intValue());
    }

    @Override
    public HistorialDTO asignarUsuarioAProyecto(HistorialDTO dto) {

        Integer idUsuario = dto.getIdUsuario();
        Long idProyecto = dto.getIdProyecto();

        //  Verifica si ya existe esa asignación
        boolean yaExiste = historialTrabajoRepository
                .existsByUsuario_IdUsuarioAndProyecto_IdProyecto(idUsuario, idProyecto);

        if (yaExiste) {
            throw new RuntimeException("El usuario ya está asignado a este proyecto.");
        }

        //  Busca usuario y proyecto
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        //  Crea entidad
        HistorialTrabajo historial = dto.toEntity(usuario, proyecto);

        historial = historialTrabajoRepository.save(historial);
        return HistorialDTO.fromEntity(historial);
    }



}
