package com.backend.portalroshkabackend.tools.mapper;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.Models.Novedades;
import com.backend.portalroshkabackend.Models.Usuario;

public class NovedadesMapper {

    public static Novedades toEntityFromInsertDto(NovedadesInsertDto dto, Usuario usuario){
        Novedades novedad = new Novedades();
        novedad.setTitulo(dto.getTitulo());
        novedad.setDescripcion(dto.getDescripcion());
        novedad.setPrioridad(dto.getPrioridad());
        novedad.setImagenUrl(dto.getImagenUrl());
        novedad.setFechaExpiracion(dto.getFechaExpiracion());
        novedad.setActivo(true);
        novedad.setUsuario(usuario);
        return novedad;
    }

    public static NovedadesDefaultResponseDto toDefaultResponseDto(Integer id, String titulo, String message){
        NovedadesDefaultResponseDto dto = new NovedadesDefaultResponseDto();
        dto.setId(id);
        dto.setTitulo(titulo);
        dto.setMessage(message);
        return dto;
    }

    public static Novedades toEntityFromUpdateDto(NovedadesUpdateDto dto, Novedades novedad){
        if (dto.getTitulo() != null) novedad.setTitulo(dto.getTitulo());
        if (dto.getDescripcion() != null) novedad.setDescripcion(dto.getDescripcion());
        if (dto.getImagenUrl() != null) novedad.setImagenUrl(dto.getImagenUrl());
        if (dto.getFechaExpiracion() != null) novedad.setFechaExpiracion(dto.getFechaExpiracion());
        if(dto.getPrioridad() != null) novedad.setPrioridad(dto.getPrioridad());
        return novedad;

    }
    public static NovedadesResponseDto toResponseDto(Novedades novedad){
        NovedadesResponseDto dto = new NovedadesResponseDto();
        dto.setIdNovedades(novedad.getIdNovedades());
        dto.setTitulo(novedad.getTitulo());
        dto.setDescripcion(novedad.getDescripcion());
        dto.setImagenUrl(novedad.getImagenUrl());
        dto.setActivo(novedad.getActivo());
        dto.setFechaExpiracion(novedad.getFechaExpiracion());
        dto.setPrioridad(novedad.getPrioridad());
        return dto;
    }
}
