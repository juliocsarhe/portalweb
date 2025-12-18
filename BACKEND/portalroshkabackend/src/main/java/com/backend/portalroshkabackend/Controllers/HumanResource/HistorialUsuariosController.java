package com.backend.portalroshkabackend.Controllers.HumanResource;


import com.backend.portalroshkabackend.DTO.Operationes.HistorialResponseDTO;
import com.backend.portalroshkabackend.Services.Operations.Interface.IHistorialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/th/usuarios")

public class HistorialUsuariosController {

    private final IHistorialService historialService;


    @GetMapping("/{idUsuario}/historial")
    public ResponseEntity<List<HistorialResponseDTO>> historialPorUsuario(@PathVariable Integer idUsuario){
        return ResponseEntity.ok(
                historialService.listarHistorialPorUsuario(idUsuario)
        );
    }





}
