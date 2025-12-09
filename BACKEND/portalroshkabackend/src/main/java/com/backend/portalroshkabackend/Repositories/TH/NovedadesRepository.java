package com.backend.portalroshkabackend.Repositories.TH;

import com.backend.portalroshkabackend.Models.Novedades;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NovedadesRepository extends JpaRepository<Novedades, Integer> {

    List<Novedades> findByActivoTrueOrderByPrioridadDesc();
    List<Novedades> findByCategoriaAndActivoTrue(String categoria);
   /* List<Novedades> findByIdRol_IdRolAndActivoTrue(Integer idRol); */
    //TODO: preguntar sobre validez de este consulta

    @Query("SELECT n FROM Novedades n WHERE n.fechaExpiracion > CURRENT_DATE AND n.activo = true")
    List<Novedades> findVigentes();
}
