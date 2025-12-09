package com.backend.portalroshkabackend.Services.Operations.Service.Equipo;

import com.backend.portalroshkabackend.DTO.Operationes.EquiposRequestDto;
import com.backend.portalroshkabackend.DTO.Operationes.EquiposResponseDto;
import com.backend.portalroshkabackend.DTO.Operationes.UsuarioAsignacionDto;
import com.backend.portalroshkabackend.Models.Enum.EstadoActivoInactivo;
import com.backend.portalroshkabackend.Models.Equipos;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.OP.EquiposRepository;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import com.backend.portalroshkabackend.Services.Operations.Interface.Equipo.IEquiposService;
import com.backend.portalroshkabackend.tools.mapper.EquiposMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service

public class EquiposServiceImpl implements IEquiposService {

    private final EquiposRepository equiposRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public EquiposServiceImpl(EquiposRepository equiposRepository,
                              UsuarioRepository usuarioRepository) {
        this.equiposRepository = equiposRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public EquiposResponseDto crearEquipo(EquiposRequestDto dto){

        Usuario lider = usuarioRepository.findById(dto.getIdLider())
                .orElseThrow(() -> new RuntimeException("Lider no encontrado"));

        Equipos equipo = new Equipos();
        equipo.setNombre(dto.getNombre().trim());
        equipo.setLider(lider);
        equipo.setEstado(dto.getEstado());
        equipo.setFechaCreacion(LocalDateTime.now());

        equipo = equiposRepository.save(equipo);

        if (dto.getUsuarios() != null) {
            for (Integer idUsuario : dto.getUsuarios()) {
                Usuario usuario = usuarioRepository.findById(idUsuario)
                        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                equipo.getUsuarios().add(usuario);
            }
        }

        equipo = equiposRepository.save(equipo);

        return EquiposMapper.toResponse(equipo);
    }

    @Override
    public EquiposResponseDto obtenerPorId(Integer id) {
        Equipos equipo = equiposRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
        return EquiposMapper.toResponse(equipo);
    }
                //Listar Equuipos
    public List<EquiposResponseDto> listarEquipos(){
        return  equiposRepository.findAll()
                .stream()
                .map(EquiposMapper::toResponse)
                .toList();
    }

                //Traer por id

    public EquiposResponseDto editarEquipo(Integer id, EquiposRequestDto dto) {
        Equipos equipo = equiposRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        if (dto.getEstado() != null)
            equipo.setEstado((dto.getEstado()));

        equipo.getUsuarios().clear();

        if (dto.getUsuarios() != null) {
            for (Integer idUsuario : dto.getUsuarios()) {
                Usuario usuario = usuarioRepository.findById(idUsuario)
                        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                equipo.getUsuarios().add(usuario);
            }
        }
        equipo = equiposRepository.save(equipo);

        return EquiposMapper.toResponse(equipo);
    }
    public void toggleEquipo(Integer idEquipo) {
        Equipos equipo = equiposRepository.findById(idEquipo)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        equipo.setEstado(
                equipo.getEstado() == EstadoActivoInactivo.A
                        ? EstadoActivoInactivo.I
                        : EstadoActivoInactivo.A
        );

        equiposRepository.save(equipo);
    }

    }


