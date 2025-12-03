package com.backend.portalroshkabackend.Services.HumanResource.subservices;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.Models.Novedades;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.TH.NovedadesRepository;

import com.backend.portalroshkabackend.Repositories.TH.UserRepository;
import com.backend.portalroshkabackend.tools.RepositoryService;
import com.backend.portalroshkabackend.tools.errors.errorslist.novedades.NovedadesUserNotFoundException;
import com.backend.portalroshkabackend.tools.mapper.NovedadesMapper;
import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.backend.portalroshkabackend.tools.MessagesConst.DATABASE_DEFAULT_ERROR;
import static com.backend.portalroshkabackend.tools.MessagesConst.NOVEDADES_CREATED_MESSAGE;

@Service
public class NovedadesServiceImpl implements INovedadesService {

    private final ValidatorStrategy<NovedadesInsertDto> insertValidator;
    private final NovedadesRepository novedadesRepository;
    private final RepositoryService repositoryService;
    private final UserRepository userRepository;

    @Autowired
    public NovedadesServiceImpl(NovedadesRepository novedadesRepository,
                                @Qualifier("novedadInsertValidatorComposite") ValidatorStrategy<NovedadesInsertDto> insertValidator,
                                RepositoryService repositoryService,
                                UserRepository userRepository) {

        this.novedadesRepository = novedadesRepository;
        this.insertValidator = insertValidator;
        this.repositoryService = repositoryService;
        this.userRepository = userRepository;
    }

    @Override
    public NovedadesDefaultResponseDto create(NovedadesInsertDto dto) {

        insertValidator.validate(dto);

        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario user = userRepository.findByCorreo(correo)
                .orElseThrow(NovedadesUserNotFoundException::new);

        Novedades novedades = NovedadesMapper.toEntityFromInsertDto(dto, user);

        Novedades savedNovedades = repositoryService.save(
                novedadesRepository,
                novedades,
                DATABASE_DEFAULT_ERROR
        );
        return NovedadesMapper.toDefaultResponseDto(savedNovedades.getIdNovedades(), novedades.getTitulo(), NOVEDADES_CREATED_MESSAGE);
    }

    @Override
    public List<NovedadesDefaultResponseDto> getAll() {
        return novedadesRepository.findAll().stream().map(NovedadesDefaultResponseDto::of).toList();
    }

    @Override
    public List<NovedadesDefaultResponseDto> getActivas() {
        return novedadesRepository.findVigentes().stream().map(NovedadesDefaultResponseDto::of).toList();
    }

    @Override
    public List<NovedadesDefaultResponseDto> getByRol(Integer idRol) {
        return novedadesRepository.findByIdRol_IdRolAndActivoTrue(idRol)
                .stream().map(NovedadesDefaultResponseDto::of).toList();
    }

    @Override
    public List<NovedadesDefaultResponseDto> getByCategoria(String categoria) {
        return novedadesRepository.findByCategoriaAndActivoTrue(categoria)
                .stream().map(NovedadesDefaultResponseDto::of).toList();
    }

    @Override
    public List<NovedadesDefaultResponseDto> getCarrusel() {
        return novedadesRepository.findVigentes().stream()
                .filter(n -> n.getImagenUrl() != null)
                .map(NovedadesDefaultResponseDto::of).toList();
    }

    @Override
    public List<NovedadesDefaultResponseDto> getAvisos() {
        return novedadesRepository.findVigentes().stream()
                .filter(n -> n.getImagenUrl() == null)
                .map(NovedadesDefaultResponseDto::of).toList();
    }

    //TODO: continuar con refactorización de servicios
}
