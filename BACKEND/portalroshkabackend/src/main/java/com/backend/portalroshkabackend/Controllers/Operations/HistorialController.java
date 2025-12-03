package com.backend.portalroshkabackend.Controllers.Operations;

import com.backend.portalroshkabackend.DTO.Operationes.HistorialDTO;
import com.backend.portalroshkabackend.DTO.common.UserDto;
import com.backend.portalroshkabackend.Services.Operations.Interface.IHistorialService;
import com.backend.portalroshkabackend.Services.UsuariosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HistorialController {

    private final IHistorialService historialService;
    private final UsuariosService usuariosService;



    @PostMapping("/api/v1/admin/operations/historial")
    public ResponseEntity<HistorialDTO> asignarUsuarioAProyecto(@RequestBody HistorialDTO dto) {
        HistorialDTO creado = historialService.asignarUsuarioAProyecto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @GetMapping("/api/v1/admin/operations/historial/{idHistorial}")
    public ResponseEntity<HistorialDTO> obtenerHistorialPorId(@PathVariable Integer idHistorial) {
        HistorialDTO dto = historialService.obtenerHistorialPorId(idHistorial);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/api/v1/admin/operations/historial/usuario/{idUsuario}")
    public ResponseEntity<List<HistorialDTO>> listarHistorialPorUsuario(@PathVariable Integer idUsuario) {
        // tu service espera Long, por eso convertimos
        List<HistorialDTO> lista = historialService.listarHistorialPorUsuario(idUsuario);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/api/v1/admin/operations/historial/proyecto/{idProyecto}")
    public ResponseEntity<List<HistorialDTO>> listarHistorialPorProyecto(@PathVariable Integer idProyecto) {
        List<HistorialDTO> lista = historialService.listarHistorialPorProyecto(idProyecto);
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/api/v1/admin/operations/historial/{idHistorial}")
    public ResponseEntity<HistorialDTO> actualizarHistorial(
            @PathVariable Integer idHistorial,
            @RequestBody HistorialDTO dto
    ) {
        HistorialDTO actualizado = historialService.actualizarHistorial(idHistorial, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/api/v1/admin/operations/historial/{idHistorial}")
    public ResponseEntity<Void> eliminarHistorial(@PathVariable Integer idHistorial) {
        historialService.eliminarHistorial(idHistorial);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/api/v1/historial/mis-proyectos")
    public ResponseEntity<List<HistorialDTO>> verMiHistorial() {

        UserDto usuarioActual = usuariosService.getUsuarioActual();
        if (usuarioActual == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Integer idUsuario = usuarioActual.getIdUsuario();

        return ResponseEntity.ok(historialService.listarHistorialPorUsuario(idUsuario));
    }
}
