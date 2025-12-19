package com.backend.portalroshkabackend.Services.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.HistorialDescripcionDTO;
import com.backend.portalroshkabackend.Models.Usuario;

public interface IHistorialDescripcionService {

    void registrarDescripcion(HistorialDescripcionDTO dto, Usuario usuarioLogueado);



}
