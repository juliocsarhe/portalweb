package com.backend.portalroshkabackend.Controllers.HumanResource;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesResponseDto;
import com.backend.portalroshkabackend.Services.HumanResource.INovedadesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/usuarios/novedades")
public class NovedadesUsersController {

    private final INovedadesService novedadesService;

    // GET ALL
    @GetMapping
    public ResponseEntity<List<NovedadesResponseDto>> getAll()
    {
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



