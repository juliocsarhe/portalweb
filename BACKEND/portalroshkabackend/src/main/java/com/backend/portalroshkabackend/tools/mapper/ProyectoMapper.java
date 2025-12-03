package com.backend.portalroshkabackend.tools.mapper;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoDTO;
import com.backend.portalroshkabackend.Models.Proyecto;

public class ProyectoMapper {
    public  static ProyectoDTO toDTO(Proyecto entity){
        if (entity == null) return null;

        ProyectoDTO dto = new ProyectoDTO();
        dto.setIdProyecto(entity.getIdProyecto());
        dto.setNombre(entity.getNombre());
        dto.setLiderEquipo(entity.getLiderEquipo());
        dto.setTecnologias(entity.getTecnologias());
        dto.setDescripcion(entity.getDescripcion());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setFechaLimite(entity.getFechaLimite());
        dto.setEstado(entity.getEstado());
        dto.setActivo(entity.getActivo());
        return dto;
    }
    public static Proyecto toEntity(ProyectoDTO dto) {
        if (dto == null) return null;

        Proyecto entity = new Proyecto();
        entity.setIdProyecto(dto.getIdProyecto());
        entity.setNombre(dto.getNombre());
        entity.setLiderEquipo(dto.getLiderEquipo());
        entity.setTecnologias(dto.getTecnologias());
        entity.setDescripcion(dto.getDescripcion());
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaLimite(dto.getFechaLimite());
        entity.setEstado(dto.getEstado());
        entity.setActivo(dto.getActivo());
        return entity;
    }
}
