package com.backend.portalroshkabackend.Controllers.Operations;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoRequestDto;
import com.backend.portalroshkabackend.DTO.Operationes.ProyectoResponseDto;
import com.backend.portalroshkabackend.Services.Operations.Interface.IProyectoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/operations/proyectos")
@RequiredArgsConstructor
public class ProyectoController {

    private final IProyectoService proyectoService;

    @PostMapping
    public ResponseEntity<ProyectoResponseDto> crearProyecto(@RequestBody ProyectoRequestDto requestDto){
        return  ResponseEntity.ok(proyectoService.crearProyecto(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProyectoResponseDto> obtenerProyecto(@PathVariable Integer id){
        return  ResponseEntity.ok(proyectoService.obtenerProyectoPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ProyectoResponseDto>> listarProyectos() {
        return ResponseEntity.ok(proyectoService.listarProyectos());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProyectoResponseDto> actualizarProyectos(
            @PathVariable Integer id,
            @RequestBody ProyectoRequestDto dto
    ) {

        return ResponseEntity.ok(proyectoService.actualizarProyectos(id, dto));
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<Void> eliminarProyecto(@PathVariable Integer id){
        proyectoService.eliminarProyecto(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> manejarErrores(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }


}
