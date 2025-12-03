package com.backend.portalroshkabackend.Controllers.Operations;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoDTO;
import com.backend.portalroshkabackend.Services.Operations.Interface.IProyectoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/operations/proyectos")
@RequiredArgsConstructor
public class ProyectoController {

    private final IProyectoService proyectoService;

    @PostMapping
    public ResponseEntity<ProyectoDTO> crearProyecto(@RequestBody ProyectoDTO dto){
        ProyectoDTO creado = proyectoService.crearProyecto(dto);
        return  ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProyectoDTO> obtenerProyecto(@PathVariable Long id){
        ProyectoDTO dto = proyectoService.obtenerProyectoPorId(id);
        return  ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<ProyectoDTO>> listarProyectos() {
        List<ProyectoDTO> lista = proyectoService.listarProyectos();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProyectoDTO> actualizarProyecto(
            @PathVariable Long id,
            @RequestBody ProyectoDTO dto
    ) {
        ProyectoDTO actualizado = proyectoService.actualizarProyecto(id, dto);
        return ResponseEntity.ok(actualizado);
    }


}
