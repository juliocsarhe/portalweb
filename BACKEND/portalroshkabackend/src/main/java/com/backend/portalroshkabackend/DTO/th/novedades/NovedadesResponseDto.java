package com.backend.portalroshkabackend.DTO.th.novedades;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class NovedadesResponseDto {
    private Integer idNovedades;
    private String titulo;
    private String descripcion;
    private String imagenUrl;
    private LocalDate fechaExpiracion;
    private Boolean activo;
    private Boolean prioridad;

}
