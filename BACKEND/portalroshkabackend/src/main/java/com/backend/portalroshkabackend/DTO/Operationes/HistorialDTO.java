package com.backend.portalroshkabackend.DTO.Operationes;

import com.backend.portalroshkabackend.Models.HistorialTrabajo;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Models.Usuario;
import lombok.Data;

import java.time.LocalDate;

@Data
public class HistorialDTO {

    private Long idHistorial;

    private Integer idUsuario;
    private Long idProyecto;

    private  String nombreProyecto;
    private String liderEquipo;
    private String tecnologias;

    private LocalDate fechaInicial;
    private LocalDate fechaLimite;

    private String descripcion;
    private Boolean disponibleParaNuevos;


    public static HistorialDTO fromEntity(HistorialTrabajo h){
        HistorialDTO dto = new HistorialDTO();

        dto.setIdHistorial(h.getIdHistorial());
        dto.setIdUsuario(h.getUsuario().getIdUsuario());
        dto.setIdProyecto(h.getProyecto().getIdProyecto());

        dto.setNombreProyecto(h.getProyecto().getNombre());
        dto.setLiderEquipo(h.getProyecto().getLiderEquipo());
        dto.setTecnologias(h.getProyecto().getTecnologias());

        dto.setFechaInicial(h.getFechaInicio());
        dto.setFechaLimite(h.getFechaLimite());

        dto.setDescripcion(h.getDescripcion());
        dto.setDisponibleParaNuevos(h.getDisponibleParaNuevos());

        return  dto;
    }

    public HistorialTrabajo toEntity(Usuario usuario, Proyecto proyecto){
        HistorialTrabajo h = new HistorialTrabajo();

        h.setIdHistorial(this.idHistorial);
        h.setUsuario(usuario);
        h.setProyecto(proyecto);

        h.setFechaInicio(this.fechaInicial);
        h.setFechaLimite(this.fechaLimite);
        h.setDescripcion(this.descripcion);
        h.setDisponibleParaNuevos(this.disponibleParaNuevos);

        return  h;
    }

}

