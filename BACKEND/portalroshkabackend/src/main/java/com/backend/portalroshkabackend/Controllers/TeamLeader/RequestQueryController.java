package com.backend.portalroshkabackend.Controllers.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.request.TeamLeaderAllRequestResponseDto;
import com.backend.portalroshkabackend.DTO.th.SolicitudByIdResponseDto;
import com.backend.portalroshkabackend.DTO.th.SolicitudResponseDto;
import com.backend.portalroshkabackend.Services.TeamLeader.IRequestQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/teamleader")
public class RequestQueryController {

    private final IRequestQueryService requestQueryService;

    @GetMapping("/requests/{id}")
    public ResponseEntity<SolicitudByIdResponseDto> getSolicitudById(@PathVariable Integer id) {

        SolicitudByIdResponseDto solicitud = requestQueryService.getRequestById(id);
        return  ResponseEntity.ok(solicitud);
    }

    @GetMapping("/requests")
    public ResponseEntity<Page<TeamLeaderAllRequestResponseDto>> getAllRequests(
            @PageableDefault(direction = Sort.Direction.ASC) Pageable pageRequest
    ) {
        Page<TeamLeaderAllRequestResponseDto> solicitudes = requestQueryService.getAllRequests(pageRequest);
        return ResponseEntity.ok(solicitudes);
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<Page<TeamLeaderAllRequestResponseDto>> getPendingRequests(
            @PageableDefault(direction = Sort.Direction.ASC) Pageable pageRequest
    ){
        Page<TeamLeaderAllRequestResponseDto> solicitudes = requestQueryService.getPendingRequests(pageRequest);
        return ResponseEntity.ok(solicitudes);
    }


    @GetMapping("/requests/vacations")
    public ResponseEntity<Page<SolicitudResponseDto>> getVacationRequests(
            @PageableDefault(direction = Sort.Direction.ASC) Pageable pageRequest
    ){
        Page<SolicitudResponseDto> solicitudes = requestQueryService.getVacationsRequests(pageRequest);
        return ResponseEntity.ok(solicitudes);
    }

    @GetMapping("/requests/permissions")
    public ResponseEntity<Page<SolicitudResponseDto>> getPermissionsRequests(
            @PageableDefault(direction = Sort.Direction.ASC) Pageable pageRequest

    ){
        Page<SolicitudResponseDto> solicitudes = requestQueryService.getPermissionsRequests(pageRequest);
        return ResponseEntity.ok(solicitudes);
    }


}
