package com.backend.portalroshkabackend.Repositories;

import com.backend.portalroshkabackend.Models.Proyecto;
import java.util.Optional;

import com.backend.portalroshkabackend.Models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProyectoRepository extends JpaRepository<Proyecto, Integer> {

    Optional<Proyecto> findByNombre(String nombre);

    Optional<Proyecto> findByLiderEquipo(Usuario liderEquipo);


    boolean existsByLiderEquipo_IdUsuario(Integer idUsuario);
}
