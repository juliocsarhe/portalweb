package com.backend.portalroshkabackend.DTO.TeamLeader;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioEquipoProyectoDTO {

    private Integer idUsuario;
    private String nombre;
    private String apellido;

    private Integer idEquipo;
    private String nombreEquipo;

    private Integer idProyecto;
    private String nombreProyecto;
}
