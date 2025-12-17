package com.backend.portalroshkabackend.tools.mapper;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoRequestDto;
import com.backend.portalroshkabackend.DTO.Operationes.ProyectoResponseDto;
import com.backend.portalroshkabackend.DTO.Operationes.TecnologiasDto;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Models.Tecnologias;

import java.util.stream.Collectors;

public class ProyectoMapper {
    public  static Proyecto toEntity(ProyectoRequestDto proyectoRequestDto){
        if (proyectoRequestDto == null) return null;

        Proyecto entity  = new Proyecto();

        entity.setNombre(proyectoRequestDto.getNombre());
        entity.setDescripcion(proyectoRequestDto.getDescripcion());
        entity.setFechaInicio(proyectoRequestDto.getFechaInicio());
        entity.setFechaLimite(proyectoRequestDto.getFechaLimite());
        entity.setEstado(proyectoRequestDto.getEstado());
        return entity;
    }
    public static ProyectoResponseDto toDto(Proyecto entity) {
        if (entity == null) return null;

        ProyectoResponseDto proyectoResponseDto = new ProyectoResponseDto();

        proyectoResponseDto.setIdProyecto(entity.getIdProyecto());
        proyectoResponseDto.setNombre(entity.getNombre());


        if (entity.getLiderEquipo() != null) {
            proyectoResponseDto.setIdLiderEquipo(entity.getLiderEquipo().getIdUsuario());
            proyectoResponseDto.setNombreLider(entity.getLiderEquipo().getNombre());
        }

        if (entity.getEquipos()!= null){
            proyectoResponseDto.setIdEquipo(entity.getEquipos().getIdEquipo());
            proyectoResponseDto.setNombreEquipo(entity.getEquipos().getNombre());
        }

        if(entity.getClientes()!=null){
            proyectoResponseDto.setIdCliente(entity.getClientes().getIdCliente());
            proyectoResponseDto.setNombreCliente(entity.getClientes().getNombre());
        }

        if (entity.getTecnologias()!=null){
            proyectoResponseDto.setTecnologias(
                    entity.getTecnologias().stream()
                            .map(t -> new TecnologiasDto(
                                    t.getIdTecnologia(),
                                    t.getNombre(),
                                    t.getDescripcion()
                            ))
                            .collect(Collectors.toList())
            );
        }

        proyectoResponseDto.setDescripcion(entity.getDescripcion());
        proyectoResponseDto.setFechaInicio(entity.getFechaInicio());
        proyectoResponseDto.setFechaLimite(entity.getFechaLimite());
        proyectoResponseDto.setEstado(entity.getEstado());
        proyectoResponseDto.setActivo(entity.getActivo());
        return proyectoResponseDto;
    }
}
