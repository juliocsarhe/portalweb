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
public class NovedadesController {

    private final INovedadesService novedadesService;


    //RUTAS PRIVADAS

    @PostMapping ("/api/v1/admin/th/novedades")
    public ResponseEntity<NovedadesDefaultResponseDto> create(
            @RequestBody NovedadesInsertDto dto
    ){
        return ResponseEntity.ok(novedadesService.create(dto));
    }

    @PutMapping ("/api/v1/admin/th/novedades")
    public ResponseEntity<NovedadesDefaultResponseDto> update(
            @RequestBody NovedadesUpdateDto dto
    ){
        return ResponseEntity.ok(novedadesService.update(dto));
    }

    //DELETE novedades ("/api/v1/admin/th/novedades/{id}")
    @DeleteMapping("/api/v1/admin/th/novedades/{id}")
    public ResponseEntity<NovedadesDefaultResponseDto> delete(
            @PathVariable Integer id
    ){
        return ResponseEntity.ok(novedadesService.delete(id));
    }



    //RUTAS PUBLICAS

    // GET ALL

    @GetMapping ("/api/v1/usuarios/novedades")
    public ResponseEntity<List<NovedadesResponseDto>> getAll(){
        return ResponseEntity.ok(novedadesService.getAll());
    }

    // GET ACTIVAS (solo las que están vigentes)

    @GetMapping(("/api/v1/usuarios/novedades/activas"))
    public ResponseEntity<List<NovedadesResponseDto>> getActivas(){
        return ResponseEntity.ok(novedadesService.getActivas());
    }

    // GET POR PRIORIDAD

    @GetMapping("/api/v1/usuarios/novedades/prioridad")
    public ResponseEntity<List<NovedadesResponseDto>> getByPrioridad(){
        return ResponseEntity.ok(novedadesService.getByPrioridad());
    }

    // GET CARRUSEL (solo con imagen)

    @GetMapping("/api/v1/usuarios/novedades/carrusel")
    public ResponseEntity<List<NovedadesResponseDto>> getCarrusel(){
        return ResponseEntity.ok(novedadesService.getCarrusel());
    }

    // GET AVISOS (sin imagen)

    @GetMapping("/api/v1/usuarios/novedades/avisos")
    public ResponseEntity<List<NovedadesResponseDto>> getAvisos(){
        return ResponseEntity.ok(novedadesService.getAvisos());
    }


    @GetMapping("/api/v1/usuarios/novedades/fecha/desc")
    public ResponseEntity<List<NovedadesResponseDto>> getOrdenadasPorFechaDesc() {
        return ResponseEntity.ok(novedadesService.getOrdenadasPorFechaDesc());
    }


    @GetMapping("/api/v1/usuarios/novedades/fecha/asc")
    public ResponseEntity<List<NovedadesResponseDto>> getOrdenadasPorFechaAsc() {
        return ResponseEntity.ok(novedadesService.getOrdenadasPorFechaAsc());
    }


    //TODO: consultar validez de obtener por buscar por idRol
    //TODO: consultar sobre rutas correctas

}



