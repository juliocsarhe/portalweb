package com.backend.portalroshkabackend.tools.mapper;

import com.backend.portalroshkabackend.DTO.TeamLeader.TeamLeaderDefaultResponse;
import com.backend.portalroshkabackend.DTO.TeamLeader.request.TeamLeaderRequestResponseDto;
import com.backend.portalroshkabackend.Models.Solicitud;
import org.springframework.stereotype.Component;


@Component
public class RequestTeamLeaderMapper {

    public TeamLeaderRequestResponseDto toTeamLeaderRequestByIdDto(Solicitud solicitud) {
        TeamLeaderRequestResponseDto dto = new TeamLeaderRequestResponseDto();
        dto.setIdSolicitud(solicitud.getIdSolicitud());
        dto.setIdUsuario(solicitud.getUsuario().getIdUsuario());
        dto.setNombreUsuario(solicitud.getUsuario().getNombre() + " " + solicitud.getUsuario().getApellido());

        dto.setDocumentoAdjunto(
                solicitud.getDocumentoAdjunto() != null
                        ? solicitud.getDocumentoAdjunto().getNombreArchivo()
                        : null
        );

        if(solicitud.getComentario() != null){
            dto.setComentario(limpiarComentario(solicitud.getComentario()));
        }

        if (solicitud.getCantDias() != null){
            dto.setCantDias(solicitud.getCantDias());
        } else {
            dto.setCantDias(0);
        }

        if(solicitud.getFechaInicio() != null){
            dto.setFechaInicio(solicitud.getFechaInicio());
        }

        if (solicitud.getFechaFin() != null){
            dto.setFechaFin(solicitud.getFechaFin());
        }

        dto.setTipoSolicitud(
                solicitud.getTipoSolicitud() != null
                        ? solicitud.getTipoSolicitud().toString()
                        : null
        );

        dto.setEstado(
                solicitud.getEstado() != null
                    ? solicitud.getEstado().toString()
                    : null
        );

        dto.setFechaCreacion(solicitud.getFechaCreacion());
        return dto;
    }

    public TeamLeaderDefaultResponse toTeamLeaderDefaultResponseDto(int idRequest, String message) {
        TeamLeaderDefaultResponse response = new TeamLeaderDefaultResponse();
        response.setIdSolicitud(idRequest);
        response.setMessage(message);
        return response;
    }




    private String limpiarComentario(String comentario) {
        if (comentario == null) return null;

        return comentario.replaceAll("\\(\\d+\\)", "")
                .replaceAll("\\{\\d+}", "")
                .trim();
    }

}
