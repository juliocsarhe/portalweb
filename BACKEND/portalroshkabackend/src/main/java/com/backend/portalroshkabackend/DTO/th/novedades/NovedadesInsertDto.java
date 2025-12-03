package com.backend.portalroshkabackend.DTO.th.novedades;

import com.backend.portalroshkabackend.Models.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NovedadesInsertDto {

    private String titulo;
    private String descripcion;
    private String imagenUrl;
    private LocalDate fechaExpiracion;
    private String categoria;
    private String prioridad;
}
