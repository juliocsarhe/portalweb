package com.backend.portalroshkabackend.DTO.TeamLeader.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TeamLeaderAllRequestResponseDto {
    private Integer idSolicitud;

    private Integer idUsuario;

    private String nombreUsuario;

    private String tipoSolicitud;

    private String estado;


}
