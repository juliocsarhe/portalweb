package com.backend.portalroshkabackend.DTO.Operationes;


import com.backend.portalroshkabackend.Models.Proyecto;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProyectoResponseDto {

    private Integer idProyecto;

    private String nombre;

    private Integer idLiderEquipo;
    private String nombreLider;

    private Integer idEquipo;
    private String nombreEquipo;

    private Integer idCliente;
    private String nombreCliente;

    private List<Integer> tecnologias;

    private String descripcion;

    private LocalDate fechaInicio;
    private LocalDate fechaLimite;

    private Proyecto.EstadoProyectoEnum estado;

    private Boolean activo;

}
