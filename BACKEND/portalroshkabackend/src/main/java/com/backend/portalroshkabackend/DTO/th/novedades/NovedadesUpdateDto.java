package com.backend.portalroshkabackend.DTO.th.novedades;

import com.backend.portalroshkabackend.Models.Usuario;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Data
public class NovedadesUpdateDto {
    private String titulo;
    private String descripcion;
    private String imagenUrl;
    private LocalDate fechaExpiracion;
}
