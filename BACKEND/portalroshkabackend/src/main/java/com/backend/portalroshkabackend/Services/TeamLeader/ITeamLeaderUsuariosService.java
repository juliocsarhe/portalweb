package com.backend.portalroshkabackend.Services.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.UsuarioEquipoProyectoDTO;

import java.util.List;

public interface ITeamLeaderUsuariosService {

        List<UsuarioEquipoProyectoDTO> listarUsuariosDeMiEquipo(Integer idLider);

}
