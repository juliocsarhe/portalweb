package com.backend.portalroshkabackend.Services.HumanResource.subservices;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesUpdateDto;
import com.backend.portalroshkabackend.Models.Novedades;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.TH.NovedadesRepository;

import com.backend.portalroshkabackend.Repositories.TH.UserRepository;
import com.backend.portalroshkabackend.tools.RepositoryService;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.NovedadNotFoundException;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.NovedadesUserNotFoundException;
import com.backend.portalroshkabackend.tools.mapper.NovedadesMapper;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final UserRepository userRepository;

    @Autowired
    public NovedadesServiceImpl(NovedadesRepository novedadesRepository,
                                @Qualifier("novedadInsertValidatorComposite") ValidatorStrategy<NovedadesInsertDto> insertValidator,
                                @Qualifier("novedadUpdateValidatorComposite") ValidatorStrategy<NovedadesUpdateDto> updateValidator,
                                RepositoryService repositoryService,
                                UserRepository userRepository) {

        this.novedadesRepository = novedadesRepository;
        this.insertValidator = insertValidator;
        this.updateValidator = updateValidator;
        this.repositoryService = repositoryService;
        this.userRepository = userRepository;
    }

    @Override
    public NovedadesDefaultResponseDto create(NovedadesInsertDto dto) {

        insertValidator.validate(dto);

        // Obtener usuario del token JWT
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario user = userRepository.findByCorreo(correo)
                .orElseThrow(NovedadesUserNotFoundException::new);

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
                .filter(n -> n.getImagenUrl() != null && !n.getImagenUrl().trim().isEmpty())
                .map(NovedadesMapper::toResponseDto)
                .toList();
    }

    @Override
    public List<NovedadesResponseDto> getAvisos() {
        return novedadesRepository.findVigentes().stream()
                .filter(n -> n.getImagenUrl() == null || n.getImagenUrl().trim().isEmpty())
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
