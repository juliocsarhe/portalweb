package com.backend.portalroshkabackend.Services.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.TeamLeaderDefaultResponse;
import com.backend.portalroshkabackend.Models.Enum.EstadoSolicitudEnum;
import com.backend.portalroshkabackend.Models.Enum.SolicitudesEnum;
import com.backend.portalroshkabackend.Models.Solicitud;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.TH.SolicitudRepository;
import com.backend.portalroshkabackend.Services.TeamLeader.subservices.IAcceptRequestTeamLeaderService;
import com.backend.portalroshkabackend.notification.NotificationService;
import com.backend.portalroshkabackend.notification.webSocket.events.NotificarSolicitudRechazadaEvent;
import com.backend.portalroshkabackend.tools.RepositoryService;
import com.backend.portalroshkabackend.tools.errors.errorslist.solicitudes.RequestNotFoundException;
import com.backend.portalroshkabackend.tools.errors.errorslist.teamLeader.TeamLeaderNotAuthorized;
import com.backend.portalroshkabackend.tools.mapper.RequestTeamLeaderMapper;
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
    private final RequestTeamLeaderMapper requestMapper;
    private final RepositoryService repositoryService;
    private final ValidatorStrategy<Solicitud> requestValidator;

    @Autowired
    public RequestCommandServiceImpl(
            SolicitudRepository solicitudRepository,
            List<IAcceptRequestTeamLeaderService> strategyList,
            SecurityUtils securityUtils,
            NotificationService notificationService,
            RequestTeamLeaderMapper requestMapper,
            RepositoryService repositoryService,
            @Qualifier("requestHandlerValidator")ValidatorStrategy<Solicitud> requestValidator
            ) {
        this.solicitudRepository = solicitudRepository;
        this.securityUtils = securityUtils;
        this.notificationService = notificationService;
        this.requestMapper = requestMapper;
        this.acceptStrategies = strategyList.stream()
                .collect(Collectors.toMap(IAcceptRequestTeamLeaderService::getType, Function.identity()));
        this.repositoryService = repositoryService;
        this.requestValidator = requestValidator;
    }

    @Override
    @Transactional
    public TeamLeaderDefaultResponse acceptRequest(int idRequest) {

        Solicitud request = repositoryService.findByIdOrThrow(
                solicitudRepository,
                idRequest,
                () -> new RequestNotFoundException(idRequest)
        );

        Usuario usuario = securityUtils.getUsuarioActual();

        if(request.getLider() == null
                || !request.getLider().getIdUsuario().equals(usuario.getIdUsuario())
                || !securityUtils.hasRole(usuario, SecurityUtils.ROLE_TEAM_LIDER)) {

            throw new TeamLeaderNotAuthorized();
        }

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

        return requestMapper.toTeamLeaderDefaultResponseDto(acceptedRequest.getIdSolicitud(), REQUEST_ACCEPTED_MESSAGE );
    }



    @Override
    @Transactional
    public TeamLeaderDefaultResponse rejectRequest(int idSolicitud){
        Solicitud solicitud = repositoryService.findByIdOrThrow(
                solicitudRepository,
                idSolicitud,
                () -> new RequestNotFoundException(idSolicitud)
        );
        requestValidator.validate(solicitud);

        Usuario usuario = securityUtils.getUsuarioActual();
        if(solicitud.getLider() == null
                || !solicitud.getLider().getIdUsuario().equals(usuario.getIdUsuario())
                || !securityUtils.hasRole(usuario, SecurityUtils.ROLE_TEAM_LIDER)){

            throw new TeamLeaderNotAuthorized();
        }

        solicitud.setEstado(EstadoSolicitudEnum.R);

        notificationService.notifyUserses(solicitud, false);
        notificationService.alertTH(solicitud, false);
        NotificarSolicitudRechazadaEvent event = new NotificarSolicitudRechazadaEvent();

        repositoryService.save(
                solicitudRepository,
                solicitud,
                DATABASE_DEFAULT_ERROR
        );
        return requestMapper.toTeamLeaderDefaultResponseDto(solicitud.getIdSolicitud(), REQUEST_REJECTED_MESSAGE);
    }

}
