package com.backend.portalroshkabackend.DTO.th.novedades;

import com.backend.portalroshkabackend.Models.Novedades;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NovedadesDefaultResponseDto {

    private Integer id;
    private String titulo;
    private String message;

}
