package com.backend.portalroshkabackend.Services.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.HistorialDescripcionDTO;
import org.springframework.security.core.Authentication;

public interface IHistorialDescripcionService {

    void registrarDescripcion(HistorialDescripcionDTO dto, Authentication usuarioLogueado);

}
