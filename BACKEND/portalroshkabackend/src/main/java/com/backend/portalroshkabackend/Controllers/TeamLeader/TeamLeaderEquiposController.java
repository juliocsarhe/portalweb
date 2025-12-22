package com.backend.portalroshkabackend.Controllers.TeamLeader;


import com.backend.portalroshkabackend.DTO.TeamLeader.UsuarioEquipoProyectoDTO;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import com.backend.portalroshkabackend.Services.TeamLeader.ITeamLeaderUsuariosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/teamleader")

public class TeamLeaderEquiposController {

    private final ITeamLeaderUsuariosService teamLeaderUsuariosService;
    private final UsuarioRepository usuarioRepository;


    @GetMapping("/equipos/usuarios")
    public ResponseEntity<List<UsuarioEquipoProyectoDTO>> listarUsuarios(Authentication authentication){


        Usuario lider = usuarioRepository.findByCorreo(authentication.getName()).orElseThrow();


        return ResponseEntity.ok(teamLeaderUsuariosService.listarUsuariosDeMiEquipo(lider.getIdUsuario())
        );

    }



}
