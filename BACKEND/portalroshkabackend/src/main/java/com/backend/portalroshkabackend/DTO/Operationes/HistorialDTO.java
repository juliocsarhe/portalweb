package com.backend.portalroshkabackend.DTO.Operationes;


import lombok.Data;

import java.time.LocalDate;

@Data
public class HistorialDTO {

    private Integer idHistorial;

    private Integer idUsuario;
    private Integer idProyecto;

    private  String nombreProyecto;

    private Integer idEquipo;
    private String nombreEquipo;

    private LocalDate fechaInicial;
    private LocalDate fechaFin;

    private String descripcion;

    private Boolean activo;

}

