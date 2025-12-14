package com.backend.portalroshkabackend.Services.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.TeamLeaderDefaultResponse;

public interface IRequestsCommandService {

    TeamLeaderDefaultResponse acceptRequest(int idSolicitud);
    TeamLeaderDefaultResponse rejectRequest(int idSolicitud);

}
