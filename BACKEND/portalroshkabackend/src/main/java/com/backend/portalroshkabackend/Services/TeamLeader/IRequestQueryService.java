package com.backend.portalroshkabackend.Services.TeamLeader;


import com.backend.portalroshkabackend.DTO.TeamLeader.request.TeamLeaderAllRequestResponseDto;
import com.backend.portalroshkabackend.DTO.th.SolicitudByIdResponseDto;
import com.backend.portalroshkabackend.DTO.th.SolicitudResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IRequestQueryService {

    SolicitudByIdResponseDto getRequestById(Integer idRequest);
    Page<TeamLeaderAllRequestResponseDto> getAllRequests(Pageable pageRequest);
    Page<TeamLeaderAllRequestResponseDto> getPendingRequests(Pageable pageRequest);
    Page<SolicitudResponseDto> getVacationsRequests(Pageable pageRequest);
    Page<SolicitudResponseDto> getPermissionsRequests(Pageable pageRequest);
}
