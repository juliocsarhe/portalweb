package com.backend.portalroshkabackend.Services.HumanResource.subservices;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;

import java.util.List;

public interface INovedadesService {

    NovedadesDefaultResponseDto create(NovedadesInsertDto dto);

    List<NovedadesDefaultResponseDto> getAll();

    List<NovedadesDefaultResponseDto> getActivas();

    List<NovedadesDefaultResponseDto> getByRol(Integer idRol);

    List<NovedadesDefaultResponseDto> getByCategoria(String categoria);

    List<NovedadesDefaultResponseDto> getCarrusel();

    List<NovedadesDefaultResponseDto> getAvisos();

}
