package com.backend.portalroshkabackend.Services.Operations.Service;


import com.backend.portalroshkabackend.Models.Equipos;
import com.backend.portalroshkabackend.Models.HistorialTrabajo;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.HistorialTrabajoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class HistorialTrabajoService {

    private final HistorialTrabajoRepository historialRepository;

    @Transactional
    public void registrarIngresoProyecto(
            Usuario usuario,
            Proyecto proyecto,
            Equipos equipo,
            String descripcion
    ) {
        historialRepository.findByUsuario_IdUsuarioAndActivoTrue(
                usuario.getIdUsuario()
        ).ifPresent(historialTrabajo -> {
            historialTrabajo.setFechaFin(LocalDate.now());
            historialTrabajo.setActivo(false);
        });

            HistorialTrabajo historialnuevo = new HistorialTrabajo();
        historialnuevo.setUsuario(usuario);
        historialnuevo.setProyecto(proyecto);
        historialnuevo.setEquipos(equipo);
        historialnuevo.setFechaInicio(LocalDate.now());
        historialnuevo.setDescripcion(descripcion);
        historialnuevo.setActivo(true);

        historialRepository.save(historialnuevo);
    }

         @Transactional
     public void registrarSalidaProyecto(Usuario usuario) {
        historialRepository.findByUsuario_IdUsuarioAndActivoTrue(
                usuario.getIdUsuario()
        ).ifPresent(h -> {
            h.setFechaFin(LocalDate.now());
            h.setActivo(false);
        });
    }
}