package com.backend.portalroshkabackend.Repositories;

import com.backend.portalroshkabackend.Models.HistorialTrabajo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HistorialTrabajoRepository extends JpaRepository<HistorialTrabajo, Integer> {
    List<HistorialTrabajo> findByUsuario_IdUsuario(Integer idUsuario);

    List<HistorialTrabajo> findByProyecto_IdProyecto(Integer idProyecto);

    boolean existsByUsuario_IdUsuarioAndProyecto_IdProyecto(Integer idUsuario, Integer idProyecto);

    Optional<HistorialTrabajo> findByUsuario_IdUsuarioAndProyecto_IdProyecto(
            Integer idUsuario,
            Integer idProyecto
    );

}
