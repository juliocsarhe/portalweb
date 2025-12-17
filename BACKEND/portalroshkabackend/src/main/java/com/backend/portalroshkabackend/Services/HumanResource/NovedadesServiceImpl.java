package com.backend.portalroshkabackend.Services.HumanResource;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.Models.Novedades;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.TH.NovedadesRepository;

import com.backend.portalroshkabackend.tools.RepositoryService;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.NovedadNotAuthorizedException;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.NovedadNotFoundException;
import com.backend.portalroshkabackend.tools.mapper.NovedadesMapper;
import com.backend.portalroshkabackend.tools.security.SecurityUtils;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.backend.portalroshkabackend.tools.MessagesConst.*;

@Service
public class NovedadesServiceImpl implements INovedadesService {

    private final ValidatorStrategy<NovedadesInsertDto> insertValidator;
    private final ValidatorStrategy<NovedadesUpdateDto> updateValidator;
    private final NovedadesRepository novedadesRepository;
    private final RepositoryService repositoryService;
    private final SecurityUtils securityUtils;

    @Autowired
    public NovedadesServiceImpl(NovedadesRepository novedadesRepository,
                                @Qualifier("novedadInsertValidatorComposite") ValidatorStrategy<NovedadesInsertDto> insertValidator,
                                @Qualifier("novedadUpdateValidatorComposite") ValidatorStrategy<NovedadesUpdateDto> updateValidator,
                                RepositoryService repositoryService,
                                SecurityUtils securityUtils) {

        this.novedadesRepository = novedadesRepository;
        this.insertValidator = insertValidator;
        this.updateValidator = updateValidator;
        this.repositoryService = repositoryService;
        this.securityUtils = securityUtils;
    }

    @Override
    public NovedadesDefaultResponseDto create(NovedadesInsertDto dto) {

        Usuario user = securityUtils.getUsuarioActual();
        if (!securityUtils.hasRole(user, SecurityUtils.ROLE_TALENTO_HUMANO)) {
            throw new NovedadNotAuthorizedException();
        }

        insertValidator.validate(dto);

        // Mapear DTO a entidad
        Novedades novedad = NovedadesMapper.toEntityFromInsertDto(dto, user);

        // Fecha de creación automática
        novedad.setFechaCreacion(LocalDateTime.now());

        // Guardar en BD
        Novedades savedNovedad = repositoryService.save(
                novedadesRepository,
                novedad,
                DATABASE_DEFAULT_ERROR
        );

        return NovedadesMapper.toDefaultResponseDto(
                savedNovedad.getIdNovedades(),
                savedNovedad.getTitulo(),
                NOVEDADES_CREATED_MESSAGE
        );
    }

    @Override
    public NovedadesDefaultResponseDto update(NovedadesUpdateDto dto) {

        Usuario user = securityUtils.getUsuarioActual();
        if (!securityUtils.hasRole(user, SecurityUtils.ROLE_TALENTO_HUMANO)) {
            throw new NovedadNotAuthorizedException();
        }

        updateValidator.validate(dto);

        // 1. Buscar la novedad por ID
        Novedades novedad = novedadesRepository.findById(dto.getId())
                .orElseThrow(() -> new NovedadNotFoundException("Novedad no encontrada"));

        // 2. Actualizar solo los campos enviados
        Novedades updatedNovedad = NovedadesMapper.toEntityFromUpdateDto(dto, novedad);

        // 3. Guardar los cambios
        Novedades savedNovedad = repositoryService.save(
                novedadesRepository,
                updatedNovedad,
                DATABASE_DEFAULT_ERROR
        );

        // 4. Respuesta
        return NovedadesMapper.toDefaultResponseDto(
                savedNovedad.getIdNovedades(),
                savedNovedad.getTitulo(),
                NOVEDADES_UPDATED_MESSAGE
        );
    }


    @Override
    public NovedadesDefaultResponseDto delete(Integer id) {

        Usuario user = securityUtils.getUsuarioActual();
        if (!securityUtils.hasRole(user, SecurityUtils.ROLE_TALENTO_HUMANO)) {
            throw new NovedadNotAuthorizedException();
        }

        // Buscar la novedad
        Novedades novedad = novedadesRepository.findById(id)
                .orElseThrow(() -> new NovedadNotFoundException("Novedad no encontrada"));

        // Desactivar
        novedad.setActivo(false);

        // Guardar cambios
        Novedades deletedNovedad = repositoryService.save(
                novedadesRepository,
                novedad,
                DATABASE_DEFAULT_ERROR
        );

        return NovedadesMapper.toDefaultResponseDto(
                deletedNovedad.getIdNovedades(),
                deletedNovedad.getTitulo(),
                NOVEDADES_DELETED_MESSAGE
        );
    }


    @Override
    public List<NovedadesResponseDto> getAll() {
        return novedadesRepository.findAll()
                .stream()
                .map(NovedadesMapper::toResponseDto)
                .toList();
    }

    @Override
    public List<NovedadesResponseDto> getActivas() {
        return novedadesRepository.findVigentes()
                .stream()
                .map(NovedadesMapper::toResponseDto)
                .toList();
    }


    @Override
    public List<NovedadesResponseDto> getCarrusel() {
        return novedadesRepository.findVigentes()
                .stream()
                .filter(n -> n.getImagenUrl() != null)
                .map(NovedadesMapper::toResponseDto)
                .toList();
    }

    @Override
    public List<NovedadesResponseDto> getAvisos() {
        return novedadesRepository.findVigentes().stream()
                .filter(n -> n.getImagenUrl() == null)
                .map(NovedadesMapper::toResponseDto)
                .toList();
    }

    @Override
    public List<NovedadesResponseDto> getByPrioridad() {
        return novedadesRepository.findAllByOrderByPrioridadDescFechaExpiracionAsc()
                .stream()
                .filter(Novedades::getActivo)
                .filter(n -> n.getFechaExpiracion() != null && n.getFechaExpiracion().isAfter(java.time.LocalDate.now()))
                .map(NovedadesMapper::toResponseDto)
                .toList();
    }

    @Override
    public List<NovedadesResponseDto> getOrdenadasPorFechaDesc() {
        return novedadesRepository.findAllByOrderByFechaCreacionDesc()
                .stream()
                .map(NovedadesMapper::toResponseDto)
                .toList();
    }

    @Override
    public List<NovedadesResponseDto> getOrdenadasPorFechaAsc() {
        return novedadesRepository.findAllByOrderByFechaCreacionAsc()
                .stream()
                .map(NovedadesMapper::toResponseDto)
                .toList();
    }


}
