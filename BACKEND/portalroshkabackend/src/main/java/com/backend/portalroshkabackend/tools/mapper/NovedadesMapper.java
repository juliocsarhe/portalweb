package com.backend.portalroshkabackend.tools.mapper;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.Models.Novedades;
import com.backend.portalroshkabackend.Models.Usuario;

public class NovedadesMapper {

    public static Novedades toEntityFromInsertDto(NovedadesInsertDto dto, Usuario usuario){
        Novedades novedad =  new Novedades();
        novedad.setTitulo(dto.getTitulo());
        novedad.setDescripcion(dto.getDescripcion());
        novedad.setCategoria(dto.getCategoria());
        novedad.setPrioridad(dto.getPrioridad());
        novedad.setImagenUrl(dto.getImagenUrl());
        novedad.setFechaExpiracion(dto.getFechaExpiracion());
        novedad.setActivo(true);
        novedad.setUsuario(usuario);
        return novedad;
    }

    public static NovedadesDefaultResponseDto toDefaultResponseDto(Integer novedadUsuario, String titulo, String message){

    }
}
