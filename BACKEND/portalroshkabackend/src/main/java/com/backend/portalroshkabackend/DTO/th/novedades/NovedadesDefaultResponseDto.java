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

    // Método necesario para los stream.map
    public static NovedadesDefaultResponseDto of(Novedades n) {
        NovedadesDefaultResponseDto dto = new NovedadesDefaultResponseDto();
        dto.setId(n.getIdNovedades());
        dto.setTitulo(n.getTitulo());
        dto.setMessage("OK");
        return dto;
    }
}


