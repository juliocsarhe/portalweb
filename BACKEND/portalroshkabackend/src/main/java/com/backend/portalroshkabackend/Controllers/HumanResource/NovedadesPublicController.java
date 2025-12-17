package com.backend.portalroshkabackend.Controllers.HumanResource;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesResponseDto;
import com.backend.portalroshkabackend.Services.HumanResource.subservices.INovedadesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping ("/api/v1/usuarios")
public class NovedadesPublicController {

    private final INovedadesService novedadesService;

    @GetMapping("/novedades")
    public ResponseEntity<List<NovedadesResponseDto>> getAll(){
        return ResponseEntity.ok(novedadesService.getAll());
    }


    @GetMapping(("/novedades/activas"))
    public ResponseEntity<List<NovedadesResponseDto>> getActivas(){
        return ResponseEntity.ok(novedadesService.getActivas());
    }

    // GET POR PRIORIDAD

    @GetMapping("/novedades/prioridad")
    public ResponseEntity<List<NovedadesResponseDto>> getByPrioridad(){
        return ResponseEntity.ok(novedadesService.getByPrioridad());
    }

    // GET CARRUSEL (solo con imagen)

    @GetMapping("/novedades/carrusel")
    public ResponseEntity<List<NovedadesResponseDto>> getCarrusel(){
        return ResponseEntity.ok(novedadesService.getCarrusel());
    }

    // GET AVISOS (sin imagen)

    @GetMapping("/novedades/avisos")
    public ResponseEntity<List<NovedadesResponseDto>> getAvisos(){
        return ResponseEntity.ok(novedadesService.getAvisos());
    }


    @GetMapping("/novedades/fecha/desc")
    public ResponseEntity<List<NovedadesResponseDto>> getOrdenadasPorFechaDesc() {
        return ResponseEntity.ok(novedadesService.getOrdenadasPorFechaDesc());
    }


    @GetMapping("/novedades/fecha/asc")
    public ResponseEntity<List<NovedadesResponseDto>> getOrdenadasPorFechaAsc() {
        return ResponseEntity.ok(novedadesService.getOrdenadasPorFechaAsc());
    }

}

