package com.backend.portalroshkabackend.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name="proyectos")
@Data
@NoArgsConstructor
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proyecto")

    private Long idProyecto;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "lider_equipo")
    private String liderEquipo;

    @Column(columnDefinition = "TEXT")
    private String tecnologias;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_limite")
    private LocalDate fechaLimite;

    @Column(name = "estado")
    private String estado; // ACTIVO, FINALIZADO, PAUSADO

    @Column(nullable = false)
    private Boolean activo = true;
}
