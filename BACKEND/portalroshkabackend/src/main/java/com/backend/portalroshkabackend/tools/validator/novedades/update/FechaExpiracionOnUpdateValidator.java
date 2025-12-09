package com.backend.portalroshkabackend.tools.validator.novedades.update;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.InvalidDateException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class FechaExpiracionOnUpdateValidator implements ValidatorStrategy<NovedadesUpdateDto> {

    @Override
    public void validate(NovedadesUpdateDto dto) {
        if(dto.getFechaExpiracion().isBefore(LocalDate.now()) || dto.getFechaExpiracion().isEqual(LocalDate.now())){
            throw new InvalidDateException("Fecha de expiración inválida.");
        }
    }
}
