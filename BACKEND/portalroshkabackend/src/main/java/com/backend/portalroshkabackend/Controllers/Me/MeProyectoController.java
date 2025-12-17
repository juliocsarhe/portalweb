package com.backend.portalroshkabackend.Controllers.Me;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoResponseDto;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.ProyectoRepository;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import com.backend.portalroshkabackend.tools.mapper.ProyectoMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/me/proyectos")
@RequiredArgsConstructor
public class MeProyectoController {

    private final UsuarioRepository usuarioRepository;
    private final ProyectoRepository proyectoRepository;

    @GetMapping
    public ResponseEntity<List<ProyectoResponseDto>> obtenerMisProyectos(
            Authentication authentication
    ) {
        String correo = authentication.getName();

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Proyecto> proyectos = proyectoRepository
                .findAllByEquipos_Usuarios_IdUsuario(usuario.getIdUsuario());


        List<ProyectoResponseDto> response = proyectos.stream()
                .map(ProyectoMapper::toDto)
                .toList();

        return ResponseEntity.ok(response);
    }
}
