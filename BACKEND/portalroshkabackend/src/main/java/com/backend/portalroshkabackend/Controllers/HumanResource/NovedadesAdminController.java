package com.backend.portalroshkabackend.Controllers.HumanResource;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesResponseDto;
import com.backend.portalroshkabackend.Services.HumanResource.INovedadesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/admin/th/novedades")
public class NovedadesAdminController {

        private final INovedadesService novedadesService;

        @GetMapping
        public ResponseEntity<List<NovedadesResponseDto>> getAll() {
            return ResponseEntity.ok(novedadesService.getAll());
        }
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

}
