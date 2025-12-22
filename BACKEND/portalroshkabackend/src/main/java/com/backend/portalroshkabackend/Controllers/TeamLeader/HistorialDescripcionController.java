package com.backend.portalroshkabackend.Controllers.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.HistorialDescripcionDTO;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Services.TeamLeader.IHistorialDescripcionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/teamleader")
public class HistorialDescripcionController {

    private final IHistorialDescripcionService historialDescripcionService;

    @PostMapping("/historial/descripcion")
    @PreAuthorize("hasAnyAuthority('ROLE_5','ROLE_6','ROLE_2')")
    public ResponseEntity<Void> registrarDescripcion(
            @RequestBody HistorialDescripcionDTO historialDto,
            Authentication authentication
    ) {
        historialDescripcionService.registrarDescripcion(historialDto, authentication);
        return ResponseEntity.ok().build();
    }

}
