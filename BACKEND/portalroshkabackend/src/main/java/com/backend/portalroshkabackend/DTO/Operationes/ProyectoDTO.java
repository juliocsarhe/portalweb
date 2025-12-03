package com.backend.portalroshkabackend.DTO.Operationes;


import com.backend.portalroshkabackend.Models.Proyecto;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProyectoDTO {

    private Long idProyecto;
    private String nombre;
    private String liderEquipo;
    private String tecnologias;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaLimite;
    private String estado;
    private Boolean activo;

    public static ProyectoDTO fromEntity(Proyecto p) {
        ProyectoDTO dto = new ProyectoDTO();

        dto.setIdProyecto(p.getIdProyecto());
        dto.setNombre(p.getNombre());
        dto.setLiderEquipo(p.getLiderEquipo());
        dto.setTecnologias(p.getTecnologias());
        dto.setDescripcion(p.getDescripcion());
        dto.setFechaInicio(p.getFechaInicio());
        dto.setFechaLimite(p.getFechaLimite());
        dto.setEstado(p.getEstado());
        dto.setActivo(p.getActivo());

        return dto;

    }

    public Proyecto toEntity() {
        Proyecto p = new Proyecto();

        p.setIdProyecto(this.idProyecto);
        p.setNombre(this.nombre);
        p.setLiderEquipo(this.liderEquipo);
        p.setTecnologias(this.tecnologias);
        p.setDescripcion(this.descripcion);
        p.setFechaInicio(this.fechaInicio);
        p.setFechaLimite(this.fechaLimite);
        p.setEstado(this.estado);
        p.setActivo(this.activo);

        return p;
    }
}