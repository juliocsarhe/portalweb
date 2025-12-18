package com.backend.portalroshkabackend.Services.TeamLeader.subservices;

import com.backend.portalroshkabackend.Models.Enum.SolicitudesEnum;
import com.backend.portalroshkabackend.Models.PermisosAsignados;
import com.backend.portalroshkabackend.Models.Solicitud;
import com.backend.portalroshkabackend.Models.TipoPermisos;
import com.backend.portalroshkabackend.Repositories.PermisosRepository;
import com.backend.portalroshkabackend.Repositories.TH.PermisosAsignadosRepository;
import com.backend.portalroshkabackend.tools.RepositoryService;
import com.backend.portalroshkabackend.tools.errors.errorslist.permisos.PermissionTypeNotFoundException;
import com.backend.portalroshkabackend.tools.errors.errorslist.solicitudes.RequestAlreadyAcceptedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.backend.portalroshkabackend.tools.MessagesConst.DATABASE_DEFAULT_ERROR;


@Service("acceptPermissionsTeamLeader")
@RequiredArgsConstructor
public class AcceptPermissionsServiceImpl implements IAcceptRequestTeamLeaderService {


    private final PermisosAsignadosRepository permisosAsignadosRepository;
    private final RepositoryService repositoryService;
    private final PermisosRepository permisosRepository;

    @Override
    public void acceptRequest(Solicitud solicitud) {
        Optional<PermisosAsignados> permisosAsignadosOptional = permisosAsignadosRepository
                .findBySolicitud_idSolicitud(solicitud.getIdSolicitud());

        PermisosAsignados permisosAsignados;

        if (permisosAsignadosOptional.isPresent()) {
            permisosAsignados = permisosAsignadosOptional.get();
            if (permisosAsignados.getConfirmacionTH() == true)
                throw new RequestAlreadyAcceptedException(solicitud.getIdSolicitud());
        } else {
            permisosAsignados = new PermisosAsignados();
            String comentario = solicitud.getComentario();
            Integer idTipoPermiso = extraerIdTipoPermiso(comentario);

            if (idTipoPermiso == null) {
                throw new IllegalArgumentException("No se pudo extraer el tipo de permiso del comentario.");
            }

            TipoPermisos tipoPermiso = repositoryService.findByIdOrThrow(
                    permisosRepository,
                    idTipoPermiso,
                    () -> new PermissionTypeNotFoundException(idTipoPermiso)

            );
            permisosAsignados.setTipoPermiso(tipoPermiso);
            permisosAsignados.setSolicitud(solicitud);
            permisosAsignados.setConfirmacionTH(true);

        }
        repositoryService.save(
                permisosAsignadosRepository,
                permisosAsignados,
                DATABASE_DEFAULT_ERROR
        );
    }

    @Override
    public SolicitudesEnum getType() {
        return SolicitudesEnum.PERMISO;
    }


    private Integer extraerIdTipoPermiso(String comentario) {
        Pattern pattern = Pattern.compile("\\((\\d+)\\)");
        Matcher matcher = pattern.matcher(comentario);

        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        return null;
    }
}
