package com.backend.portalroshkabackend.tools.validator.novedades.insert;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("novedadInsertValidatorComposite")
@RequiredArgsConstructor
public class NovedadInsertValidatorComposite implements ValidatorStrategy<NovedadesInsertDto> {

    private final List<ValidatorStrategy<NovedadesInsertDto>> validators;

    @Override
    public void validate(NovedadesInsertDto dto) {
        for (ValidatorStrategy<NovedadesInsertDto> v : validators){
            v.validate(dto);
        }
    }
}
