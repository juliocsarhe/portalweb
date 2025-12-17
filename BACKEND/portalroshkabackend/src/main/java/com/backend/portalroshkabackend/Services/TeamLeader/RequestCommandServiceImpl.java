package com.backend.portalroshkabackend.Services.TeamLeader;

import com.backend.portalroshkabackend.DTO.th.request.RequestResponseDto;
import com.backend.portalroshkabackend.Models.Enum.EstadoActivoInactivo;
import com.backend.portalroshkabackend.Models.Enum.EstadoSolicitudEnum;
import com.backend.portalroshkabackend.Models.Enum.SolicitudesEnum;
import com.backend.portalroshkabackend.Models.Equipos;
import com.backend.portalroshkabackend.Models.Solicitud;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.OP.AsignacionUsuarioRepository;
import com.backend.portalroshkabackend.Repositories.OP.EquiposRepository;
import com.backend.portalroshkabackend.Repositories.TH.SolicitudRepository;
import com.backend.portalroshkabackend.Services.TeamLeader.subservices.IAcceptRequestTeamLeaderService;
import com.backend.portalroshkabackend.notification.NotificationService;
import com.backend.portalroshkabackend.notification.webSocket.events.NotificarSolicitudRechazadaEvent;
import com.backend.portalroshkabackend.tools.RepositoryService;
import com.backend.portalroshkabackend.tools.errors.errorslist.solicitudes.RequestNotFoundException;
import com.backend.portalroshkabackend.tools.errors.errorslist.teamLeader.TeamLeaderNotAuthorized;
import com.backend.portalroshkabackend.tools.mapper.RequestMapper;
import com.backend.portalroshkabackend.tools.security.SecurityUtils;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.backend.portalroshkabackend.tools.MessagesConst.*;

@Service
public class RequestCommandServiceImpl implements IRequestsCommandService {

    // Mapa de estrategias: Key=Enum, Value=Servicio
    private final Map<SolicitudesEnum, IAcceptRequestTeamLeaderService> acceptStrategies;
    private final SolicitudRepository solicitudRepository;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;
    private final RequestMapper requestMapper;
    private final RepositoryService repositoryService;
    private final ValidatorStrategy<Solicitud> requestValidator;
    private final EquiposRepository equiposRepository;
    private final AsignacionUsuarioRepository asignacionUsuarioRepository;

    @Autowired
    public RequestCommandServiceImpl(
            SolicitudRepository solicitudRepository,
            List<IAcceptRequestTeamLeaderService> strategyList,
            SecurityUtils securityUtils,
            NotificationService notificationService,
            RequestMapper requestMapper,
            RepositoryService repositoryService,
            @Qualifier("requestHandlerValidator")ValidatorStrategy<Solicitud> requestValidator,
            EquiposRepository equiposRepository,
            AsignacionUsuarioRepository asignacionUsuarioRepository
    ) {
        this.solicitudRepository = solicitudRepository;
        this.securityUtils = securityUtils;
        this.notificationService = notificationService;
        this.requestMapper = requestMapper;
        this.acceptStrategies = strategyList.stream()
                .collect(Collectors.toMap(IAcceptRequestTeamLeaderService::getType, Function.identity()));
        this.repositoryService = repositoryService;
        this.requestValidator = requestValidator;
        this.equiposRepository = equiposRepository;
        this.asignacionUsuarioRepository = asignacionUsuarioRepository;
    }

    @Override
    @Transactional
    public RequestResponseDto acceptRequest(int idRequest) {

        Solicitud request = repositoryService.findByIdOrThrow(
                solicitudRepository,
                idRequest,
                () -> new RequestNotFoundException(idRequest)
        );

        Usuario leader = securityUtils.getUsuarioActual();

        if(!securityUtils.hasRole(leader, SecurityUtils.ROLE_TEAM_LIDER)) {
            throw new TeamLeaderNotAuthorized();
        }

        validateLeaderScope(request, leader);
        requestValidator.validate(request);
        request.setEstado(EstadoSolicitudEnum.A);

        //Para buscar el servicio en el mapa según la solicitud
        IAcceptRequestTeamLeaderService strategy = acceptStrategies.get(request.getTipoSolicitud());
        if (strategy == null) {
            throw new IllegalArgumentException("No existe servicio para: " + request.getTipoSolicitud()); //TODO: refactorizar excepciones
        }

        strategy.acceptRequest(request);

        Solicitud acceptedRequest = repositoryService.save(
                solicitudRepository,
                request,
                DATABASE_DEFAULT_ERROR
        );


        notificationService.alertTH(acceptedRequest, true);

        return requestMapper.toRequestResponseDto(acceptedRequest.getIdSolicitud(), REQUEST_ACCEPTED_MESSAGE );
    }



    @Override
    @Transactional
    public RequestResponseDto rejectRequest(int idSolicitud){
        Solicitud request = repositoryService.findByIdOrThrow(
                solicitudRepository,
                idSolicitud,
                () -> new RequestNotFoundException(idSolicitud)
        );
        requestValidator.validate(request);

        Usuario leader = securityUtils.getUsuarioActual();
        if(!securityUtils.hasRole(leader, SecurityUtils.ROLE_TEAM_LIDER)){
            throw new TeamLeaderNotAuthorized();
        }

        validateLeaderScope(request, leader);
        request.setEstado(EstadoSolicitudEnum.R);

        notificationService.notifyUserses(request, false);
        notificationService.alertTH(request, false);
        NotificarSolicitudRechazadaEvent event = new NotificarSolicitudRechazadaEvent();

        repositoryService.save(
                solicitudRepository,
                request,
                DATABASE_DEFAULT_ERROR
        );
        return requestMapper.toRequestResponseDto(request.getIdSolicitud(), REQUEST_REJECTED_MESSAGE);
    }


    private void validateLeaderScope(Solicitud request, Usuario leader) {

        if (request.getLider() == null ||
                !request.getLider().getIdUsuario().equals(leader.getIdUsuario())) {
            throw new TeamLeaderNotAuthorized();
        }

        List<Equipos> equiposLiderados =
                equiposRepository.findAllByLider_IdUsuario(leader.getIdUsuario());

        if (equiposLiderados.isEmpty()) {
            throw new TeamLeaderNotAuthorized();
        }

        boolean pertenece = asignacionUsuarioRepository
                .existsByEquipoInAndUsuario_IdUsuarioAndEstado(
                        equiposLiderados,
                        request.getUsuario().getIdUsuario(),
                        EstadoActivoInactivo.A
                );

        if (!pertenece) {
            throw new TeamLeaderNotAuthorized();
        }

    }

}
