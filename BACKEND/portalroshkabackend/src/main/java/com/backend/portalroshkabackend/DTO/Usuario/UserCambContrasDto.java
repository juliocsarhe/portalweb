package com.backend.portalroshkabackend.DTO.Usuario;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserCambContrasDto {
    private String contrasenaActual;
    private String nuevaContrasena;
}
