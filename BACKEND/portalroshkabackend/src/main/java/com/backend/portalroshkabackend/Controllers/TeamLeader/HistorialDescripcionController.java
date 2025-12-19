package com.backend.portalroshkabackend.Controllers.TeamLeader;


import com.backend.portalroshkabackend.DTO.TeamLeader.HistorialDescripcionDTO;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Services.TeamLeader.HistorialDescripcionServiceImpl;
import com.backend.portalroshkabackend.Services.TeamLeader.IHistorialDescripcionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/historial")

public class HistorialDescripcionController {

    private final IHistorialDescripcionService historialDescripcionService;


    @PostMapping("/descripcion")
    @PreAuthorize("hasAnyRole('TEAM_LEADER','OPERACIONES')")
    public ResponseEntity<Void> registrarDescripcion(@RequestBody HistorialDescripcionDTO historialDto,
                                                     @AuthenticationPrincipal Usuario usuario){
        historialDescripcionService.registrarDescripcion(historialDto, usuario);
        return ResponseEntity.ok().build();
    }



}
