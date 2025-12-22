package com.backend.portalroshkabackend.tools.mapper;

import com.backend.portalroshkabackend.DTO.common.DefaultResponseDto;
import org.springframework.stereotype.Component;

@Component
public class DefaultResponseMapper {


    public DefaultResponseDto build(Integer id, String message){
        return new DefaultResponseDto(id, message);
    }
}
