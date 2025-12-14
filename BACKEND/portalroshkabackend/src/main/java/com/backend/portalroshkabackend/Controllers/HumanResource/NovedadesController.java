package com.backend.portalroshkabackend.Controllers.HumanResource;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.Services.HumanResource.subservices.INovedadesService;
import com.backend.portalroshkabackend.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/admin/th/novedades")
public class NovedadesController {

    private final INovedadesService novedadesService;
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NovedadesDefaultResponseDto> create(
            @RequestBody NovedadesInsertDto dto
    ){
        return ResponseEntity.ok(novedadesService.create(dto));
    }

    @PutMapping
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

    // GET POR PRIORIDAD
    @GetMapping("/prioridad")
    public ResponseEntity<List<NovedadesResponseDto>> getByPrioridad(){
        return ResponseEntity.ok(novedadesService.getByPrioridad());
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

    @GetMapping("/fecha/desc")
    public ResponseEntity<List<NovedadesResponseDto>> getOrdenadasPorFechaDesc() {
        return ResponseEntity.ok(novedadesService.getOrdenadasPorFechaDesc());
    }

    @GetMapping("/fecha/asc")
    public ResponseEntity<List<NovedadesResponseDto>> getOrdenadasPorFechaAsc() {
        return ResponseEntity.ok(novedadesService.getOrdenadasPorFechaAsc());
    }


}



