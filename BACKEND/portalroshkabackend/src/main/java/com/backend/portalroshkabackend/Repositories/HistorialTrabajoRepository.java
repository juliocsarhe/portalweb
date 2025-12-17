package com.backend.portalroshkabackend.Repositories;

import com.backend.portalroshkabackend.Models.HistorialTrabajo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository

public interface HistorialTrabajoRepository extends JpaRepository<HistorialTrabajo, Integer> {

    List<HistorialTrabajo> findByUsuario_IdUsuarioOrderByFechaInicioDesc(Integer idUsuario);


    Optional<HistorialTrabajo> findByUsuario_IdUsuarioAndActivoTrue(Integer idUsuario);

    List<HistorialTrabajo> findByProyecto_IdProyectoOrderByFechaInicioDesc(Integer idProyecto);

    List<HistorialTrabajo> findByEquipos_IdEquipoOrderByFechaInicioDesc(Integer idEquipo);

}
