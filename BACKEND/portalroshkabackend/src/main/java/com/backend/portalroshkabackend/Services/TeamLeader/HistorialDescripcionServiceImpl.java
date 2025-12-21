package com.backend.portalroshkabackend.Services.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.HistorialDescripcionDTO;
import com.backend.portalroshkabackend.Models.Equipos;
import com.backend.portalroshkabackend.Models.HistorialTrabajo;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.HistorialTrabajoRepository;
import com.backend.portalroshkabackend.Repositories.OP.EquiposRepository;
import com.backend.portalroshkabackend.Repositories.ProyectoRepository;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HistorialDescripcionServiceImpl implements IHistorialDescripcionService {

    private final HistorialTrabajoRepository historialRepo;
    private final UsuarioRepository usuarioRepo;
    private final ProyectoRepository proyectoRepo;
    private final EquiposRepository equiposRepo;

    @Override
    public void registrarDescripcion(HistorialDescripcionDTO dto, Authentication auth) {

        Usuario usuarioAuth = usuarioRepo.findByCorreo(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));

        Equipos equipo = equiposRepo.findById(dto.getIdEquipo())
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        if (!equipo.getLider().getIdUsuario().equals(usuarioAuth.getIdUsuario())) {
            throw new RuntimeException("No eres líder de este equipo");
        }

        Usuario usuario = usuarioRepo.findById(dto.getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!equipo.getUsuarios().contains(usuario)) {
            throw new RuntimeException("El usuario no pertenece al equipo");
        }

        Proyecto proyecto = proyectoRepo.findById(dto.getIdProyecto())
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        if (!proyecto.getEquipos().getIdEquipo().equals(equipo.getIdEquipo())) {
            throw new RuntimeException("El proyecto no pertenece al equipo");
        }

        HistorialTrabajo historial = new HistorialTrabajo();
        historial.setUsuario(usuario);
        historial.setEquipos(equipo);
        historial.setProyecto(proyecto);
        historial.setDescripcion(dto.getDescripcion());
        historial.setActivo(true);

        historialRepo.save(historial);
    }}

