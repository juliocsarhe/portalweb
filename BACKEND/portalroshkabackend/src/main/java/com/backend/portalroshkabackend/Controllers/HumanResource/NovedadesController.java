package com.backend.portalroshkabackend.Controllers.HumanResource;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.Services.HumanResource.subservices.INovedadesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/admin")
public class NovedadesController {

    private final INovedadesService novedadesService;

    @PostMapping("th/novedades")
    public ResponseEntity<NovedadesDefaultResponseDto> create(
            @RequestBody NovedadesInsertDto dto
    ){
        return ResponseEntity.ok(novedadesService.create(dto));
    }
}


