package com.backend.portalroshkabackend.Repositories;

import com.backend.portalroshkabackend.Models.Equipos;
import com.backend.portalroshkabackend.Models.Proyecto;

import java.util.List;
import java.util.Optional;

import com.backend.portalroshkabackend.Models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;

public interface ProyectoRepository extends JpaRepository<Proyecto, Integer> {

    Optional<Proyecto> findByNombre(String nombre);

    Optional<Proyecto> findByLiderEquipo(Usuario liderEquipo);

    boolean existsByLiderEquipo_IdUsuario(Integer idUsuario);

    List<Proyecto> findByEquipos_Usuarios_IdUsuario(Integer idUsuario);

    Optional<Proyecto> findByEquipos(Equipos equipos);

    List<Proyecto> findAllByEquipos_Usuarios_IdUsuario(Integer idUsuario);
    List<Proyecto> findAllByEquipos_Lider_IdUsuario(Integer idUsuario);


}
