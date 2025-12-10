package com.backend.portalroshkabackend.Models;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="proyectos")
@Data
@NoArgsConstructor
public class Proyecto {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id_proyecto")
        private Integer idProyecto;

        @Column(nullable = false)
        private String nombre;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "id_lider_equipo", nullable = false)
        private Usuario liderEquipo;


        @OneToOne
        @JoinColumn(name="id_cliente",unique = true)
        private Clientes clientes;

        @OneToOne
        @JoinColumn(name="id_equipos", unique = true)
        private Equipos equipos;

        @ManyToMany
        @JoinTable(
                name = "proyecto_tecnologias", joinColumns = @JoinColumn(name = "id_proyecto"),
                inverseJoinColumns = @JoinColumn(name = "id_tecnologia")
        )
        private Set<Tecnologias> tecnologias = new HashSet<>();

        @Column(columnDefinition = "TEXT")
        private String descripcion;

        @Column(name = "fecha_inicio")
        private LocalDate fechaInicio;

        @Column(name = "fecha_limite")
        private LocalDate fechaLimite;

        public enum EstadoProyectoEnum {
            ACTIVO,
            PAUSADO,
            FINALIZADO
        } // ACTIVO, FINALIZADO, PAUSADO

        @Enumerated(EnumType.STRING)
        @Column(name = "estado", nullable = false)
        private EstadoProyectoEnum estado = EstadoProyectoEnum.ACTIVO;

        @Column(nullable = false)
        private Boolean activo = true;
}
