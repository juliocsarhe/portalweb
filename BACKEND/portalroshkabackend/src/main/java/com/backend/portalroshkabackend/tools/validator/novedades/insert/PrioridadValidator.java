package com.backend.portalroshkabackend.tools.validator.novedades.insert;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.InvalidPriorityException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PrioridadValidator implements ValidatorStrategy<NovedadesInsertDto> {

    private static final List<String> VALIDAS = List.of("BAJA", "MEDIA", "ALTA");

    @Override
    public void validate(NovedadesInsertDto dto) {
        if(dto.getPrioridad()==null || !VALIDAS.contains(dto.getPrioridad())){
            throw new InvalidPriorityException("Prioridad inválida " + dto.getPrioridad());
        }
    }
}
