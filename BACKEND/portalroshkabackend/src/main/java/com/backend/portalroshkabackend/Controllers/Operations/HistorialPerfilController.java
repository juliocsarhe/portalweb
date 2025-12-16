package com.backend.portalroshkabackend.Controllers.Operations;

import com.backend.portalroshkabackend.DTO.Operationes.HistorialResponseDTO;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import com.backend.portalroshkabackend.Services.Operations.Interface.IHistorialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/profile/historial")
public class HistorialPerfilController {

    private final IHistorialService historialService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<List<HistorialResponseDTO>>miHistorial(Authentication authentication){
        String correo = authentication.getName();

        Usuario usuario = usuarioRepository.findByCorreo(correo).orElseThrow(()->
                new RuntimeException("Usuario no encontrado"));

        return ResponseEntity.ok(
                historialService.listarHistorialPorUsuario(usuario.getIdUsuario())
        );
    }

}
