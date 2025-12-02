package com.backend.portalroshkabackend.DTO.th.novedades;

import com.backend.portalroshkabackend.Models.Novedades;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NovedadesDefaultResponseDto {

    private Integer id;
    private String titulo;
    private String descripcion;
    private String imagenUrl;
    private String categoria;
    private String prioridad;
    private Boolean activo;

    public static NovedadesDefaultResponseDto of(Novedades n) {
        NovedadesDefaultResponseDto dto = new NovedadesDefaultResponseDto();

        dto.setId(n.getIdNovedades());
        dto.setTitulo(n.getTitulo());
        dto.setDescripcion(n.getDescripcion());
        dto.setImagenUrl(n.getImagenUrl());
        dto.setCategoria(n.getCategoria());
        dto.setPrioridad(n.getPrioridad());
        dto.setActivo(n.getActivo());

        return dto;
    }
}
