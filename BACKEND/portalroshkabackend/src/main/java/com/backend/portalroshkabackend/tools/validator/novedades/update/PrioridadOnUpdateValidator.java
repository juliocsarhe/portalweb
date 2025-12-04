package com.backend.portalroshkabackend.tools.validator.novedades.update;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.InvalidPriorityException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PrioridadOnUpdateValidator implements ValidatorStrategy<NovedadesUpdateDto> {

    private static final List<String> VALIDAS = List.of("BAJA", "MEDIA", "ALTA");

    @Override
    public void validate(NovedadesUpdateDto dto) {
        if(!VALIDAS.contains(dto.getPrioridad())){
            throw new InvalidPriorityException("Prioridad inválida " + dto.getPrioridad());
        }
    }
}
