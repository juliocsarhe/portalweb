package com.backend.portalroshkabackend.DTO.th.novedades;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuarioNovedadesDto {
    private Integer idUsuario;
    private String nombre;
    private String apellido;
    private RolNovedadesDto rol;
    private String urlPerfil;
}

