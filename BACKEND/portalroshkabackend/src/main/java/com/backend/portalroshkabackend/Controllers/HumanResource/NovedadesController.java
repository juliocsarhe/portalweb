package com.backend.portalroshkabackend.Controllers.HumanResource;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.Services.HumanResource.subservices.INovedadesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/admin/th")
public class NovedadesController {

    private final INovedadesService novedadesService;

    @PostMapping("novedades")
    public ResponseEntity<NovedadesDefaultResponseDto> create(
            @RequestBody NovedadesInsertDto dto
    ){
        return ResponseEntity.ok(novedadesService.create(dto));
    }

    @PutMapping("novedades")
    public ResponseEntity<NovedadesDefaultResponseDto> update(
            @RequestBody NovedadesUpdateDto dto
    ){
        return ResponseEntity.ok(novedadesService.update(dto));
    }

    //DELETE novedades
    @DeleteMapping("/{id}")
    public ResponseEntity<NovedadesDefaultResponseDto> delete(
            @PathVariable Integer id
    ){
        return ResponseEntity.ok(novedadesService.delete(id));
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<NovedadesResponseDto>> getAll(){
        return ResponseEntity.ok(novedadesService.getAll());
    }

    // GET ACTIVAS (solo las que están vigentes)
    @GetMapping("/activas")
    public ResponseEntity<List<NovedadesResponseDto>> getActivas(){
        return ResponseEntity.ok(novedadesService.getActivas());
    }

/*    // GET POR ROL
    @GetMapping("/rol/{idRol}")
    public ResponseEntity<List<NovedadesResponseDto>> getByRol(
            @PathVariable Integer idRol
    ){
        return ResponseEntity.ok(novedadesService.getByRol(idRol));
    }
*/
    // GET POR CATEGORÍA TH - OP - AS - DT - DS - TL
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<NovedadesResponseDto>> getByCategoria(
            @PathVariable String categoria
    ){
        return ResponseEntity.ok(novedadesService.getByCategoria(categoria));
    }

    // GET CARRUSEL (solo con imagen)
    @GetMapping("/carrusel")
    public ResponseEntity<List<NovedadesResponseDto>> getCarrusel(){
        return ResponseEntity.ok(novedadesService.getCarrusel());
    }

    // GET AVISOS (sin imagen)
    @GetMapping("/avisos")
    public ResponseEntity<List<NovedadesResponseDto>> getAvisos(){
        return ResponseEntity.ok(novedadesService.getAvisos());
    }

    // GET POR PRIORIDAD (ALTA - MEDIA - BAJA)
    @GetMapping("/prioridad")
    public ResponseEntity<List<NovedadesResponseDto>> getByPrioridad(){
        return ResponseEntity.ok(novedadesService.getByPrioridad());
    }


    //TODO: consultar validez de obtener por buscar por idRol
    //TODO: consultar sobre rutas correctas

}



