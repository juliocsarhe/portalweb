package com.backend.portalroshkabackend.Controllers.Me;

import com.backend.portalroshkabackend.DTO.Operationes.EquiposResponseDto;
import com.backend.portalroshkabackend.Models.Equipos;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.OP.EquiposRepository;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import com.backend.portalroshkabackend.tools.mapper.EquiposMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/v1/me/equipo")
@RequiredArgsConstructor
public class MeEquipoController {

    private final UsuarioRepository usuarioRepository;
    private final EquiposRepository equiposRepository;

    @GetMapping
    public ResponseEntity<?> obtenerMiEquipo(Authentication authentication) {

        String correo = authentication.getName();

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Equipos> equipos = equiposRepository
                .findAllByUsuarios_IdUsuario(usuario.getIdUsuario());

        if (equipos.isEmpty()) {
            throw new RuntimeException("El usuario no pertenece a ningún equipo");
        }

        List<EquiposResponseDto> response = equipos.stream()
                .map(EquiposMapper::toDto)
                .toList();

        return ResponseEntity.ok(response);
    }
}
