package com.backend.portalroshkabackend.tools.validator.novedades.insert;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.InvalidCategoryException;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.NovedadRequiredFieldsException;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoriaValidator implements ValidatorStrategy<NovedadesInsertDto> {

    private static final List<String> VALIDAS = List.of("TH", "OP", "AS");

    @Override
    public void validate(NovedadesInsertDto dto) {
        if (dto.getCategoria() == null || !VALIDAS.contains(dto.getCategoria())) {
            throw new InvalidCategoryException("Categoría inválida: " + dto.getCategoria());
        }

    }
}
