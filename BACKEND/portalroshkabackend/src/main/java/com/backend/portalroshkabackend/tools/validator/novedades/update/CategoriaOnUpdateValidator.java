package com.backend.portalroshkabackend.tools.validator.novedades.update;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.InvalidCategoryException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoriaOnUpdateValidator implements ValidatorStrategy<NovedadesUpdateDto> {

    private static final List<String> VALIDAS = List.of("TH", "OP", "AS");

    @Override
    public void validate(NovedadesUpdateDto dto) {
        if (!VALIDAS.contains(dto.getCategoria())) {
            throw new InvalidCategoryException("Categoría inválida: " + dto.getCategoria());
        }
    }
}

//TODO: confirmar categorías válidas con el equipo
