package com.backend.portalroshkabackend.tools.mapper;

import com.backend.portalroshkabackend.DTO.Operationes.EquiposResponseDto;
import com.backend.portalroshkabackend.DTO.Operationes.UsuarioisResponseDto;
import com.backend.portalroshkabackend.Models.Equipos;

public class EquiposMapper {

    public static EquiposResponseDto toResponse(Equipos e) {

        EquiposResponseDto dto = new EquiposResponseDto();

        dto.setIdEquipo(e.getIdEquipo());
        dto.setNombre(e.getNombre());
        dto.setFechaCreacion(e.getFechaCreacion());
        dto.setEstado(e.getEstado());

        if (e.getLider() != null) {
            dto.setLider(UsuarioisResponseDto.fromEntity(e.getLider()));
        }

        if (e.getUsuarios() != null) {
            dto.setUsuarios(
                    e.getUsuarios()
                            .stream()
                            .map(UsuarioisResponseDto::fromEntity)
                            .toList()
            );
        }

        return dto;
    }

    public static EquiposResponseDto toDto(Equipos e) {
        return toResponse(e);
    }
    public EquiposResponseDto getAllTeams(Equipos e) {
        return toResponse(e);
    }
    public EquiposResponseDto getTeam(Equipos e) {
        return toResponse(e);
    }
}