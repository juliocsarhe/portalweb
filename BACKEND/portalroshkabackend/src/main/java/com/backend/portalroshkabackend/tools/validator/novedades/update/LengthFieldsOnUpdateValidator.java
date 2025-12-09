package com.backend.portalroshkabackend.tools.validator.novedades.update;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.NovedadesFieldsLengthException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.stereotype.Component;

@Component
public class LengthFieldsOnUpdateValidator implements ValidatorStrategy<NovedadesUpdateDto> {
    @Override
    public void validate(NovedadesUpdateDto dto) {
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
