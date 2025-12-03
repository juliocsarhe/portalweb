package com.backend.portalroshkabackend.Repositories;

import com.backend.portalroshkabackend.Models.Proyecto;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository extends JpaRepository<Proyecto, Integer> {

    Optional<Proyecto> findByNombre(String nombre);

    boolean existsByLiderEquipo_IdUsuario(Integer idUsuario);
}
