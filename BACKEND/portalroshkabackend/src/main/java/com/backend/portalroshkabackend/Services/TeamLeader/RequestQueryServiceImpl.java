package com.backend.portalroshkabackend.Services.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.request.TeamLeaderRequestResponseDto;
import com.backend.portalroshkabackend.Models.Enum.EstadoSolicitudEnum;
import com.backend.portalroshkabackend.Models.Enum.SolicitudesEnum;
import com.backend.portalroshkabackend.Models.Solicitud;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.TH.SolicitudRepository;
import com.backend.portalroshkabackend.tools.RepositoryService;
import com.backend.portalroshkabackend.tools.errors.errorslist.solicitudes.RequestNotFoundException;
import com.backend.portalroshkabackend.tools.errors.errorslist.teamLeader.TeamLeaderNotAuthorized;
import com.backend.portalroshkabackend.tools.mapper.RequestTeamLeaderMapper;
import com.backend.portalroshkabackend.tools.security.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class RequestQueryServiceImpl implements IRequestQueryService {

    private final SecurityUtils securityUtils;
    private final SolicitudRepository solicitudRepository;
    private final RepositoryService repositoryService;
    private final RequestTeamLeaderMapper requestMapper;

    public RequestQueryServiceImpl(
            SecurityUtils securityUtils,
            SolicitudRepository solicitudRepository,
            RepositoryService repositoryService,
            RequestTeamLeaderMapper requestMapper
    ){
        this.securityUtils = securityUtils;
        this.solicitudRepository = solicitudRepository;
        this.repositoryService = repositoryService;
        this.requestMapper = requestMapper;
    }


    @Override
    @Transactional(readOnly = true)
    public TeamLeaderRequestResponseDto getRequestById(Integer idRequest) {

        Solicitud request = repositoryService.findByIdOrThrow(
                solicitudRepository,
                idRequest,
                () -> new RequestNotFoundException(idRequest)
        );
        Usuario usuario = securityUtils.getUsuarioActual();

        boolean isOwner = usuario.getIdUsuario().equals(request.getLider().getIdUsuario());
        boolean isAllowedType = request.getTipoSolicitud() == SolicitudesEnum.PERMISO
                || request.getTipoSolicitud() == SolicitudesEnum.VACACIONES;

        if(!isOwner || !isAllowedType){
            throw new TeamLeaderNotAuthorized();
        }

        return requestMapper.toTeamLeaderRequestByIdDto(request);

    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamLeaderRequestResponseDto> getAllRequests(Pageable pageRequest) {
        Usuario leader = securityUtils.getUsuarioActual();
        if(!securityUtils.hasRole(leader, SecurityUtils.ROLE_TEAM_LIDER)){
            throw new TeamLeaderNotAuthorized(); //TODO: refactorizar excepcion
        }
        return solicitudRepository
                .findAllByLiderAndTipoSolicitudIn(
                        leader,
                        List.of(SolicitudesEnum.PERMISO, SolicitudesEnum.VACACIONES),
                        pageRequest
                )
                .map(requestMapper::toTeamLeaderRequestByIdDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamLeaderRequestResponseDto> getPendingRequests(Pageable pageRequest) {
        Usuario leader = securityUtils.getUsuarioActual();
        if(!securityUtils.hasRole(leader, SecurityUtils.ROLE_TEAM_LIDER)){
            throw new TeamLeaderNotAuthorized(); //TODO: refactorizar excepcion
        }
        return solicitudRepository
                .findAllByLiderAndEstadoAndTipoSolicitudIn(
                        leader,
                        EstadoSolicitudEnum.P,
                        List.of(SolicitudesEnum.PERMISO, SolicitudesEnum.VACACIONES),
                        pageRequest
                )
                .map(requestMapper::toTeamLeaderRequestByIdDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamLeaderRequestResponseDto> getVacationsRequests(Pageable pageRequest) {
        Usuario leader = securityUtils.getUsuarioActual();
        if(!securityUtils.hasRole(leader, SecurityUtils.ROLE_TEAM_LIDER)){
            throw new TeamLeaderNotAuthorized(); //TODO: refactorizar excepcion
        }
        return solicitudRepository
                .findAllByLiderAndTipoSolicitud(leader, SolicitudesEnum.VACACIONES, pageRequest)
                .map(requestMapper::toTeamLeaderRequestByIdDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamLeaderRequestResponseDto> getPermissionsRequests(Pageable pageRequest) {
        Usuario leader = securityUtils.getUsuarioActual();
        if(!securityUtils.hasRole(leader, SecurityUtils.ROLE_TEAM_LIDER)){
            throw new TeamLeaderNotAuthorized(); //TODO: refactorizar excepcion
        }
        return solicitudRepository
                .findAllByLiderAndTipoSolicitud(leader, SolicitudesEnum.PERMISO, pageRequest)
                .map(requestMapper::toTeamLeaderRequestByIdDto);
    }

}
