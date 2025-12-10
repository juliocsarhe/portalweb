package com.backend.portalroshkabackend.DTO.Operationes;


import com.backend.portalroshkabackend.Models.Proyecto;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProyectoRequestDto {


    private String nombre;

    private Integer idLiderEquipo;

    private Integer idEquipo;

    private Integer idCliente;

    private List<Integer> tecnologiasIds;

    private String descripcion;

    private LocalDate fechaInicio;

    private LocalDate fechaLimite;

    private Proyecto.EstadoProyectoEnum estado;

}
