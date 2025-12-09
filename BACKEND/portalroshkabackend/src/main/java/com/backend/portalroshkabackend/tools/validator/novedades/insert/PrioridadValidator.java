package com.backend.portalroshkabackend.tools.validator.novedades.insert;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.InvalidPriorityException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.stereotype.Component;

@Component
public class PrioridadValidator implements ValidatorStrategy<NovedadesInsertDto> {

    @Override
    public void validate(NovedadesInsertDto dto) {
        // Solo validar que no sea null
        if (dto.getPrioridad() == null) {
            throw new InvalidPriorityException("La prioridad no puede ser nula");
        }
    }
}
