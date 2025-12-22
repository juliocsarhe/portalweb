package com.backend.portalroshkabackend.DTO.TeamLeader;


import lombok.Data;

@Data
public class HistorialDescripcionDTO {

    private Integer idUsuario;
    private Integer idEquipo;
    private Integer idProyecto;
    private String descripcion;
}
