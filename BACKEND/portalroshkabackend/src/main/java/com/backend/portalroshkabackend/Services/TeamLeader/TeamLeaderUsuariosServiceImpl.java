package com.backend.portalroshkabackend.Services.TeamLeader;


import com.backend.portalroshkabackend.DTO.TeamLeader.UsuarioEquipoProyectoDTO;
import com.backend.portalroshkabackend.Models.AsignacionUsuarioEquipo;
import com.backend.portalroshkabackend.Models.Equipos;
import com.backend.portalroshkabackend.Models.Proyecto;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.OP.AsignacionUsuarioRepository;
import com.backend.portalroshkabackend.Repositories.OP.EquiposRepository;
import com.backend.portalroshkabackend.Repositories.ProyectoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class TeamLeaderUsuariosServiceImpl implements ITeamLeaderUsuariosService {

    private final EquiposRepository equiposRepository;
    private final ProyectoRepository proyectoRepository;


    @Override
    public List<UsuarioEquipoProyectoDTO> listarUsuariosDeMiEquipo(Integer idLider) {

        List<UsuarioEquipoProyectoDTO> listado = new ArrayList<>();

        List<Equipos> equipos = equiposRepository.findAllByLider_IdUsuario(idLider);

        for (Equipos equipo : equipos) {

            Proyecto proyecto = proyectoRepository.findByEquipos(equipo).orElse(null);


            for (Usuario usuario: equipo.getUsuarios()){
                listado.add(
                        new UsuarioEquipoProyectoDTO(
                                usuario.getIdUsuario(),
                                usuario.getNombre(),
                                usuario.getApellido(),
                                equipo.getIdEquipo(),
                                equipo.getNombre(),
                                proyecto != null ? proyecto.getIdProyecto() : null,
                                proyecto != null ? proyecto.getNombre() : null
                        )
                );

            }

        }
        return listado;
    }
}
