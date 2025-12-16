package com.backend.portalroshkabackend.Controllers.HumanResource;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
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

}



