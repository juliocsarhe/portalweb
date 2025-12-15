package com.backend.portalroshkabackend.Services.TeamLeader;

import com.backend.portalroshkabackend.DTO.TeamLeader.request.TeamLeaderRequestResponseDto;
import com.backend.portalroshkabackend.Models.Enum.EstadoActivoInactivo;
import com.backend.portalroshkabackend.Models.Enum.EstadoSolicitudEnum;
import com.backend.portalroshkabackend.Models.Enum.SolicitudesEnum;
import com.backend.portalroshkabackend.Models.Equipos;
import com.backend.portalroshkabackend.Models.Solicitud;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.OP.AsignacionUsuarioRepository;
import com.backend.portalroshkabackend.Repositories.OP.EquiposRepository;
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
    private final AsignacionUsuarioRepository asignacionUsuarioRepository;
    private final EquiposRepository equiposRepository;

    public RequestQueryServiceImpl(
            SecurityUtils securityUtils,
            SolicitudRepository solicitudRepository,
            RepositoryService repositoryService,
            RequestTeamLeaderMapper requestMapper,
            AsignacionUsuarioRepository asignacionUsuarioRepository,
            EquiposRepository equiposRepository
    ){
        this.securityUtils = securityUtils;
        this.solicitudRepository = solicitudRepository;
        this.repositoryService = repositoryService;
        this.requestMapper = requestMapper;
        this.asignacionUsuarioRepository = asignacionUsuarioRepository;
        this.equiposRepository = equiposRepository;
    }


    @Override
    @Transactional(readOnly = true)
    public TeamLeaderRequestResponseDto getRequestById(Integer idRequest) {

        Solicitud request = repositoryService.findByIdOrThrow(
                solicitudRepository,
                idRequest,
                () -> new RequestNotFoundException(idRequest)
        );
        Usuario leader = securityUtils.getUsuarioActual();


        boolean isAllowedType =
                request.getTipoSolicitud() == SolicitudesEnum.PERMISO ||
                request.getTipoSolicitud() == SolicitudesEnum.VACACIONES;

        if(!isAllowedType){
            throw new TeamLeaderNotAuthorized();
        }

        validateLeaderScope(request, leader); // validar que en realidad el lider pertenece a ese equipo

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
