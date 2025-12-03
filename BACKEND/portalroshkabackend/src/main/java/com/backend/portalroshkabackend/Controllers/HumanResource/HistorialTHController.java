package com.backend.portalroshkabackend.Controllers.HumanResource;

import com.backend.portalroshkabackend.DTO.Operationes.HistorialDTO;
import com.backend.portalroshkabackend.Services.Operations.Interface.IHistorialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/th/historial")
public class HistorialTHController {

    private final IHistorialService historialService;

    // ✔ TH puede ver historial de cualquier usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<HistorialDTO>> obtenerHistorialPorUsuario(@PathVariable Integer idUsuario) {
        List<HistorialDTO> lista = historialService.listarHistorialPorUsuario(idUsuario);
        return ResponseEntity.ok(lista);
    }

    // ✔ TH puede ver historial por proyecto
    @GetMapping("/proyecto/{idProyecto}")
    public ResponseEntity<List<HistorialDTO>> obtenerHistorialPorProyecto(@PathVariable Integer idProyecto) {
        List<HistorialDTO> lista = historialService.listarHistorialPorProyecto(idProyecto);
        return ResponseEntity.ok(lista);
    }

    // ✔ TH puede ver historial por idHistorial
    @GetMapping("/{idHistorial}")
    public ResponseEntity<HistorialDTO> obtenerHistorialPorId(@PathVariable Integer idHistorial) {
        HistorialDTO dto = historialService.obtenerHistorialPorId(idHistorial);
        return ResponseEntity.ok(dto);
    }

    // ✔ TH puede editar historial de cualquier usuario
    @PutMapping("/{idHistorial}")
    public ResponseEntity<HistorialDTO> actualizarHistorial(
            @PathVariable Integer idHistorial,
            @RequestBody HistorialDTO dto
    ) {
        return ResponseEntity.ok(historialService.actualizarHistorial(idHistorial, dto));
    }
}