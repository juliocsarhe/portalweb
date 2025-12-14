package com.backend.portalroshkabackend.Services.TeamLeader.subservices;

import com.backend.portalroshkabackend.Models.Enum.SolicitudesEnum;
import com.backend.portalroshkabackend.Models.Solicitud;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Models.VacacionesAsignadas;
import com.backend.portalroshkabackend.Repositories.TH.VacacionesAsignadasRepository;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import com.backend.portalroshkabackend.tools.RepositoryService;
import com.backend.portalroshkabackend.tools.errors.errorslist.solicitudes.RequestAlreadyAcceptedException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.backend.portalroshkabackend.tools.MessagesConst.DATABASE_DEFAULT_ERROR;

@Service("acceptVacationsTeamLeader")
@RequiredArgsConstructor
public class AcceptVacationsServiceImpl implements IAcceptRequestTeamLeaderService {

    private final VacacionesAsignadasRepository vacacionesAsignadasRepository;
    private final RepositoryService repositoryService;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    @Override
    public void acceptRequest(Solicitud solicitud) {
        Optional<VacacionesAsignadas> vacacionesAsignadasOptional = vacacionesAsignadasRepository.findBySolicitud_idSolicitud(solicitud.getIdSolicitud());

        VacacionesAsignadas vacacionesAsignadas;

        if (vacacionesAsignadasOptional.isPresent()) {
            vacacionesAsignadas = vacacionesAsignadasOptional.get();

            if (vacacionesAsignadas.getConfirmacionTH() == true)
                throw new RequestAlreadyAcceptedException(solicitud.getIdSolicitud());


        }else {
            vacacionesAsignadas = new VacacionesAsignadas();
            vacacionesAsignadas.setSolicitud(solicitud);
            vacacionesAsignadas.setDiasUtilizados(solicitud.getCantDias());
            vacacionesAsignadas.setFechaCreacion(LocalDateTime.now());
            vacacionesAsignadas.setConfirmacionTH(true);

            Usuario usuario = solicitud.getUsuario();
            usuario.setDiasVacacionesRestante(usuario.getDiasVacacionesRestante() - solicitud.getCantDias());

            repositoryService.save(
                    usuarioRepository,
                    usuario,
                    DATABASE_DEFAULT_ERROR
                );
        }
        repositoryService.save(
                vacacionesAsignadasRepository,
                vacacionesAsignadas,
                DATABASE_DEFAULT_ERROR
        );

    }

    @Override
    public SolicitudesEnum getType() {
        return SolicitudesEnum.VACACIONES;
    }
}
