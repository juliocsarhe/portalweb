package com.backend.portalroshkabackend.tools.validator.novedades.update;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.InvalidPriorityException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.stereotype.Component;

@Component
public class PrioridadOnUpdateValidator implements ValidatorStrategy<NovedadesUpdateDto> {

    @Override
    public void validate(NovedadesUpdateDto dto) {

        // Si no se envía prioridad en el update, no validar nada.
        if (dto.getPrioridad() == null) {
            return;
        }

        // Si viene prioridad, debe ser true o false.
        // (Esto siempre es cierto porque es Boolean)
        if (!(dto.getPrioridad() instanceof Boolean)) {
            throw new InvalidPriorityException("Prioridad inválida: " + dto.getPrioridad());
        }
    }
}
