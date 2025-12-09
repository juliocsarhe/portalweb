package com.backend.portalroshkabackend.Services.HumanResource.subservices;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;

import java.util.List;

public interface INovedadesService {

    NovedadesDefaultResponseDto create(NovedadesInsertDto dto);

    List<NovedadesResponseDto> getAll();

    List<NovedadesResponseDto> getActivas();

    List<NovedadesResponseDto> getCarrusel();

    List<NovedadesResponseDto> getAvisos();

    NovedadesDefaultResponseDto update(NovedadesUpdateDto dto);

    NovedadesDefaultResponseDto delete(Integer id);

    List<NovedadesResponseDto> getOrdenadasPorFechaDesc();

    List<NovedadesResponseDto> getOrdenadasPorFechaAsc();

    List<NovedadesResponseDto> getByPrioridad();
}
