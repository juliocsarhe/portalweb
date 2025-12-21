package com.backend.portalroshkabackend.tools.mapper;

import com.backend.portalroshkabackend.DTO.Operationes.HistorialResponseDTO;
import com.backend.portalroshkabackend.DTO.common.HistorialPerfilResponseDTO;
import com.backend.portalroshkabackend.Models.HistorialTrabajo;

import org.springframework.stereotype.Component;

@Component

public class HistorialTrabajoMapper {


        public HistorialResponseDTO toDto(HistorialTrabajo historial){
            HistorialResponseDTO responseDTO = new HistorialResponseDTO();

            responseDTO.setIdHistorial(historial.getIdHistorial());
            responseDTO.setIdUsuario(historial.getUsuario().getIdUsuario());
            responseDTO.setIdProyecto(historial.getProyecto().getIdProyecto());
            responseDTO.setNombreProyecto(historial.getProyecto().getNombre());
            responseDTO.setIdEquipo(historial.getEquipos().getIdEquipo());
            responseDTO.setNombreEquipo(historial.getEquipos().getNombre());

            responseDTO.setFechaInicio(historial.getFechaInicio());
            responseDTO.setFechaFin(historial.getFechaFin());

            responseDTO.setDescripcion(historial.getDescripcion());
            responseDTO.setActivo(historial.getActivo());

            return responseDTO;

        }

        public HistorialPerfilResponseDTO toPerfilDto(HistorialTrabajo historialTrabajo){

                HistorialPerfilResponseDTO historialPDto = new HistorialPerfilResponseDTO();


            historialPDto.setProyecto(historialTrabajo.getProyecto().getNombre());
            historialPDto.setEquipo(historialTrabajo.getEquipos().getNombre());
            historialPDto.setLider(historialTrabajo.getProyecto().getLiderEquipo().getNombre());

            historialPDto.setFechaInicio(historialTrabajo.getFechaInicio());
            historialPDto.setFechaFin(historialTrabajo.getFechaFin());
            historialPDto.setDescripcion(historialTrabajo.getDescripcion());

            historialPDto.setTecnologias(historialTrabajo.getProyecto().getTecnologias().stream().map(tecnologias ->
                    tecnologias.getNombre()).toList());

            return historialPDto;

    }
}
