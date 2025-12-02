package com.backend.portalroshkabackend.tools.validator.novedades.insert;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.NovedadRequiredFieldsException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.stereotype.Component;

import java.time.LocalDate;


@Component
public class NovedadRequiredFieldsValidator implements ValidatorStrategy<NovedadesInsertDto> {

    @Override
    public void validate(NovedadesInsertDto dto) {

        boolean valid =
                dto.getTitulo() != null && !dto.getTitulo().trim().isEmpty() &&
                dto.getDescripcion() != null && !dto.getDescripcion().trim().isEmpty();

        if (!valid) {
            throw new NovedadRequiredFieldsException();
        }


    }
}
