package com.backend.portalroshkabackend.Repositories.TH;

import com.backend.portalroshkabackend.Models.Novedades;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NovedadesRepository extends JpaRepository<Novedades, Integer> {

    List<Novedades> findAllByOrderByPrioridadDescFechaExpiracionAsc();
    List<Novedades> findAllByOrderByFechaCreacionDesc();
    List<Novedades> findAllByOrderByFechaCreacionAsc();
    //TODO: preguntar sobre validez de este consulta

    @Query("SELECT n FROM Novedades n WHERE n.fechaExpiracion > CURRENT_DATE AND n.activo = true")
    List<Novedades> findVigentes();
}
