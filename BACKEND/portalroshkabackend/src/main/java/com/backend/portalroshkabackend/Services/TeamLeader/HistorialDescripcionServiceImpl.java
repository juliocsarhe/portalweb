package com.backend.portalroshkabackend.Services.TeamLeader;


import com.backend.portalroshkabackend.DTO.TeamLeader.HistorialDescripcionDTO;
import com.backend.portalroshkabackend.Models.HistorialTrabajo;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.HistorialTrabajoRepository;
import com.backend.portalroshkabackend.Repositories.OP.EquiposRepository;
import com.backend.portalroshkabackend.Repositories.ProyectoRepository;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HistorialDescripcionServiceImpl implements IHistorialDescripcionService {

    private final HistorialTrabajoRepository historialRepo;
    private final UsuarioRepository usuarioRepo;
    private final ProyectoRepository proyectorepo;
    private final EquiposRepository equiposRepo;


    @Override
    public void registrarDescripcion(HistorialDescripcionDTO dto, Usuario usuarioLogueado) {

        HistorialTrabajo historial = new HistorialTrabajo();

        historial.setUsuario(usuarioRepo.getReferenceById(dto.getIdUsuario()));
        historial.setProyecto(proyectorepo.getReferenceById(dto.getIdProyecto()));
        historial.setEquipos(equiposRepo.getReferenceById(dto.getIdEquipo()));
        historial.setDescripcion(dto.getDescripcion());
        historial.setActivo(true);

        historialRepo.save(historial);

    }

}
