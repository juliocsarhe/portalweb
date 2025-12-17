package com.backend.portalroshkabackend.Services.TeamLeader;

import com.backend.portalroshkabackend.DTO.th.request.RequestResponseDto;

public interface IRequestsCommandService {

    RequestResponseDto acceptRequest(int idSolicitud);
    RequestResponseDto rejectRequest(int idSolicitud);

}
