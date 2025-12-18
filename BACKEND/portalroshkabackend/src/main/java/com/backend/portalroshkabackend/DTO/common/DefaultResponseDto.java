package com.backend.portalroshkabackend.DTO.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DefaultResponseDto {
    private Integer id;
    private String message;
}
