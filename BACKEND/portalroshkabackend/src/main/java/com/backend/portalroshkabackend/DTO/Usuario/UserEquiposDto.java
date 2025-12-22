package com.backend.portalroshkabackend.DTO.Usuario;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserEquiposDto {
    Integer idEquipo;
    String nombre;
    String lider;
    Integer porcentajeTrabajo;
}
