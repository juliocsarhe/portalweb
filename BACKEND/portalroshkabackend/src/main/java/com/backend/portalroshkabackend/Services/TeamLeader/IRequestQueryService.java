package com.backend.portalroshkabackend.Services.TeamLeader;


import com.backend.portalroshkabackend.DTO.TeamLeader.request.TeamLeaderRequestResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IRequestQueryService {

    TeamLeaderRequestResponseDto getRequestById(Integer idRequest);
    Page<TeamLeaderRequestResponseDto> getAllRequests(Pageable pageRequest);
    Page<TeamLeaderRequestResponseDto> getPendingRequests(Pageable pageRequest);
    Page<TeamLeaderRequestResponseDto> getVacationsRequests(Pageable pageRequest);
    Page<TeamLeaderRequestResponseDto> getPermissionsRequests(Pageable pageRequest);
}
