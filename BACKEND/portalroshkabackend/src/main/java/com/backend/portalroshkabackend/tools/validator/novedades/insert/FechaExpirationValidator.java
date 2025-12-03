package com.backend.portalroshkabackend.tools.validator.novedades.insert;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.InvalidDateException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class FechaExpirationValidator implements ValidatorStrategy<NovedadesInsertDto> {

    @Override
    public void validate(NovedadesInsertDto dto) {

        LocalDate hoy = LocalDate.now();

        if (dto.getFechaExpiracion() == null || dto.getFechaExpiracion().isBefore(hoy)) {
            throw new InvalidDateException("Fecha de expiración inválida");
        }
    }
}
