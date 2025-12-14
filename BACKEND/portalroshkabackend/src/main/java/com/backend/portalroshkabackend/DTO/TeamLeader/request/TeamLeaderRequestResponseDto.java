package com.backend.portalroshkabackend.DTO.TeamLeader.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TeamLeaderRequestResponseDto {
    private Integer idSolicitud;

    private Integer idUsuario;

    private String nombreUsuario;

    private String documentoAdjunto;

    private String tipoSolicitud;

    private String comentario;

    private String estado;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private Integer cantDias;

    private LocalDateTime fechaCreacion;


}
