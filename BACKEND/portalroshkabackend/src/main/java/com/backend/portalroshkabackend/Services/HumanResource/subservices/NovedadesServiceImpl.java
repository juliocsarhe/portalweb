package com.backend.portalroshkabackend.Services.HumanResource.subservices;

import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesDefaultResponseDto;
import com.backend.portalroshkabackend.DTO.th.novedades.NovedadesInsertDto;
import com.backend.portalroshkabackend.Models.Novedades;
import com.backend.portalroshkabackend.Models.Roles;
import com.backend.portalroshkabackend.Repositories.TH.NovedadesRepository;
import com.backend.portalroshkabackend.Repositories.TH.RolesRepository;

import com.backend.portalroshkabackend.tools.validator.ValidatorStrategy;
import com.backend.portalroshkabackend.tools.validator.novedades.insert.NovedadInsertValidatorComposite;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NovedadesServiceImpl implements INovedadesService {

    @Qualifier("novedadInsertValidatorComposite")
    private final ValidatorStrategy<NovedadesInsertDto> insertValidator;
    private final NovedadesRepository repo;
    private final RolesRepository rolesRepo;

    @Override
    public NovedadesDefaultResponseDto create(NovedadesInsertDto dto) {

        insertValidator.validate(dto);

        Roles rol = rolesRepo.findById(dto.getIdRol())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        Novedades n = new Novedades();
        n.setTitulo(dto.getTitulo());
        n.setDescripcion(dto.getDescripcion());
        n.setImagenUrl(dto.getImagenUrl());
        n.setFechaExpiracion(dto.getFechaExpiracion());
        n.setActivo(dto.getActivo());
        n.setCategoria(dto.getCategoria());
        n.setPrioridad(dto.getPrioridad());
        n.setIdRol(rol);

        repo.save(n);

        return NovedadesDefaultResponseDto.of(n);
    }

    @Override
    public List<NovedadesDefaultResponseDto> getAll() {
        return repo.findAll().stream().map(NovedadesDefaultResponseDto::of).toList();
    }

    @Override
    public List<NovedadesDefaultResponseDto> getActivas() {
        return repo.findVigentes().stream().map(NovedadesDefaultResponseDto::of).toList();
    }

    @Override
    public List<NovedadesDefaultResponseDto> getByRol(Integer idRol) {
        return repo.findByIdRol_IdRolAndActivoTrue(idRol)
                .stream().map(NovedadesDefaultResponseDto::of).toList();
    }

    @Override
    public List<NovedadesDefaultResponseDto> getByCategoria(String categoria) {
        return repo.findByCategoriaAndActivoTrue(categoria)
                .stream().map(NovedadesDefaultResponseDto::of).toList();
    }

    @Override
    public List<NovedadesDefaultResponseDto> getCarrusel() {
        return repo.findVigentes().stream()
                .filter(n -> n.getImagenUrl() != null)
                .map(NovedadesDefaultResponseDto::of).toList();
    }

    @Override
    public List<NovedadesDefaultResponseDto> getAvisos() {
        return repo.findVigentes().stream()
                .filter(n -> n.getImagenUrl() == null)
                .map(NovedadesDefaultResponseDto::of).toList();
    }
}
