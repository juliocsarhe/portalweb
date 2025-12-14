package com.backend.portalroshkabackend.Controllers.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.request.TeamLeaderRequestResponseDto;
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
@RequestMapping("/api/v1/admin/teamleader")
public class RequestQueryController {

    private final IRequestQueryService requestQueryService;

    @GetMapping("/requests/{id}")
    public ResponseEntity<TeamLeaderRequestResponseDto> getSolicitudById(@PathVariable Integer id) {

        TeamLeaderRequestResponseDto solicitud = requestQueryService.getRequestById(id);
        return  ResponseEntity.ok(solicitud);
    }

    @GetMapping("/requests")
    public ResponseEntity<Page<TeamLeaderRequestResponseDto>> getAllRequests(
            @PageableDefault(direction = Sort.Direction.ASC) Pageable pageRequest
    ) {
        Page<TeamLeaderRequestResponseDto> solicitudes = requestQueryService.getAllRequests(pageRequest);
        return ResponseEntity.ok(solicitudes);
    }

    @GetMapping("/requests/pending")
    public ResponseEntity<Page<TeamLeaderRequestResponseDto>> getPendingRequests(
            @PageableDefault(direction = Sort.Direction.ASC) Pageable pageRequest
    ){
        Page<TeamLeaderRequestResponseDto> solicitudes = requestQueryService.getPendingRequests(pageRequest);
        return ResponseEntity.ok(solicitudes);
    }


    @GetMapping("/requests/vacations")
    public ResponseEntity<Page<TeamLeaderRequestResponseDto>> getVacationRequests(
            @PageableDefault(direction = Sort.Direction.ASC) Pageable pageRequest
    ){
        Page<TeamLeaderRequestResponseDto> solicitudes = requestQueryService.getVacationsRequests(pageRequest);
        return ResponseEntity.ok(solicitudes);
    }

    @GetMapping("/requests/permissions")
    public ResponseEntity<Page<TeamLeaderRequestResponseDto>> getPermissionsRequests(
            @PageableDefault(direction = Sort.Direction.ASC) Pageable pageRequest

    ){
        Page<TeamLeaderRequestResponseDto> solicitudes = requestQueryService.getPermissionsRequests(pageRequest);
        return ResponseEntity.ok(solicitudes);
    }


}
