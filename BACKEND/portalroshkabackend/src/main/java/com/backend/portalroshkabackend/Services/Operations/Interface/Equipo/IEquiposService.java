package com.backend.portalroshkabackend.Services.Operations.Interface.Equipo;

import com.backend.portalroshkabackend.DTO.Operationes.UsuarioisResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.backend.portalroshkabackend.DTO.Operationes.EquiposRequestDto;
import com.backend.portalroshkabackend.DTO.Operationes.EquiposResponseDto;

import java.util.List;

public interface IEquiposService {

    EquiposResponseDto crearEquipo(EquiposRequestDto dto);

    List<EquiposResponseDto> listarEquipos();

    List<UsuarioisResponseDto> obtenerLideres();

    EquiposResponseDto obtenerPorId(Integer id);

    EquiposResponseDto editarEquipo(Integer id, EquiposRequestDto dto);

    void toggleEquipo(Integer idEquipo);

    void eliminarUsuarioDelEquipo(Integer idEquipo, Integer idUsuario);


    /*EquiposResponseDto getTeamById(Integer idEquipo);

    void postNewTeam(EquiposRequestDto equipo);

    void toggleEquipo(Integer idEquipo);

    void updateTeam(Integer idEquipo, EquiposRequestDto equipoDetails);

    Page<EquiposResponseDto> getTeamsSorted(Pageable pageable, String sortBy);*/
}
