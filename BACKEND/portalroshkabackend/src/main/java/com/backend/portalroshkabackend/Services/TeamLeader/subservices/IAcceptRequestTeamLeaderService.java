package com.backend.portalroshkabackend.Services.TeamLeader.subservices;

import com.backend.portalroshkabackend.Models.Enum.SolicitudesEnum;
import com.backend.portalroshkabackend.Models.Solicitud;

public interface IAcceptRequestTeamLeaderService {
    void acceptRequest(Solicitud solicitud);

    SolicitudesEnum getType();
}
