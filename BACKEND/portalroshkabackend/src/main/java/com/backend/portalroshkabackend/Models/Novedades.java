package com.backend.portalroshkabackend.Models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name = "novedades")
public class Novedades {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_novedades")
    private Integer idNovedades;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(name = "fecha_expiracion")
    private LocalDate fechaExpiracion;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "categoria")
    private String categoria; // TH - OP - AS - DT - DS - TL - ALL

    @Column(name = "prioridad")
    private String prioridad; // BAJA - MEDIA - ALTA

    @ManyToOne
    @JoinColumn(name = "creado_por")
    private Usuario usuario;
}
