package com.backend.portalroshkabackend.tools.validator.novedades.update;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component("novedadUpdateValidatorComposite")
@RequiredArgsConstructor
public class NovedadesUpdateValidatorComposite implements ValidatorStrategy<NovedadesUpdateDto> {

    private final List<ValidatorStrategy<NovedadesUpdateDto>> validators;

    @Override
    public void validate(NovedadesUpdateDto dto) {
        for (ValidatorStrategy<NovedadesUpdateDto> v : validators) {
            v.validate(dto);
        }

    }
}
