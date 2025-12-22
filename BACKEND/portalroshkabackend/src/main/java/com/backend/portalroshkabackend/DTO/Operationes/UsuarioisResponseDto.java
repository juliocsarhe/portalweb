package com.backend.portalroshkabackend.DTO.Operationes;

import com.backend.portalroshkabackend.Models.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioisResponseDto {

    private Integer idUsuario;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private Integer disponibilidad;

    public static UsuarioisResponseDto fromEntity(Usuario u) {
        UsuarioisResponseDto dto = new UsuarioisResponseDto();

        dto.setIdUsuario(u.getIdUsuario());
        dto.setNombre(u.getNombre());
        dto.setApellido(u.getApellido());
        dto.setCorreo(u.getCorreo());
        dto.setTelefono(u.getTelefono());

        return dto;
    }

}
