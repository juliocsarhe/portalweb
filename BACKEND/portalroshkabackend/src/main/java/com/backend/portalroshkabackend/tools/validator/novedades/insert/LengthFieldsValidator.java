package com.backend.portalroshkabackend.tools.validator.novedades.insert;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.NovedadRequiredFieldsException;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.NovedadesFieldsLengthException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;

public class LengthFieldsValidator implements ValidatorStrategy<NovedadesInsertDto> {
    @Override
    public void validate(NovedadesInsertDto dto) {
        if (dto.getTitulo().length() > 50 && dto.getDescripcion().length() > 100) {
            throw new NovedadesFieldsLengthException("Longitud del título y descripción mayor de lo esperado");
        }

        if (dto.getTitulo().length() < 50) {
            throw new NovedadesFieldsLengthException("Longitud del título mayor de lo esperado");
        }

        if(dto.getDescripcion().length() < 100) {
            throw new NovedadesFieldsLengthException("Longitud de la descripción mayor de la esperada");
        }

    }
}
