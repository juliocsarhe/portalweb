package com.backend.portalroshkabackend.Services.Operations.Service;

import com.backend.portalroshkabackend.DTO.Operationes.ProyectoRequestDto;
import com.backend.portalroshkabackend.DTO.Operationes.ProyectoResponseDto;
import com.backend.portalroshkabackend.Models.*;
import com.backend.portalroshkabackend.Repositories.OP.ClientesRepository;
import com.backend.portalroshkabackend.Repositories.OP.EquiposRepository;
import com.backend.portalroshkabackend.Repositories.OP.TecnologiaProyectoRepository;
import com.backend.portalroshkabackend.Repositories.ProyectoRepository;
import com.backend.portalroshkabackend.Services.Operations.Interface.IProyectoService;
import com.backend.portalroshkabackend.tools.mapper.ProyectoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProyectoServiceImpl implements IProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EquiposRepository equiposRepository;
    private final ClientesRepository clientesRepository;
    private final TecnologiaProyectoRepository tecnologiaProyectoRepository;
    private final HistorialTrabajoService historialTrabajoService;

    @Transactional
    @Override
    public ProyectoResponseDto crearProyecto(ProyectoRequestDto requestDto) {

        // Validar que el nombre no exista
        if (proyectoRepository.findByNombre(requestDto.getNombre()).isPresent()) {
            throw new RuntimeException("Ya existe un proyecto con este nombre.");
        }

        // Valida que el líder exista
       /* Usuario lider = usuarioRepository.findById(requestDto.getIdLiderEquipo())
                .orElseThrow(() -> new RuntimeException("El líder no existe."));


        //validar que el lider tenga rol team lider
        if (lider.getRol().getIdRol()!=6){
            throw new RuntimeException("Solo usuarios con Rol Team Leader pueden ser lideres");
        }*/

        // Crea el proyecto
        Proyecto proyecto = ProyectoMapper.toEntity(requestDto);
        //proyecto.setLiderEquipo(lider);

        //verificacion de equipo
        Equipos equipos = equiposRepository.findById(requestDto.getIdEquipo())
                .orElseThrow(()-> new RuntimeException("Equipo no encontrado"));
        proyecto.setEquipos(equipos);
        proyecto.setLiderEquipo(equipos.getLider());

        //verificacion de clientes
        Clientes clientes = clientesRepository.findById(requestDto.getIdCliente())
                .orElseThrow(()-> new RuntimeException("Cliente no encontrado"));
        proyecto.setClientes(clientes);

        if(requestDto.getTecnologiasIds()!=null){
            List<Tecnologias> lista = tecnologiaProyectoRepository.findAllById(requestDto.getTecnologiasIds());
            proyecto.setTecnologias(new HashSet<>(lista));
        }

        proyecto = proyectoRepository.save(proyecto);

        for(Usuario usuario : equipos.getUsuarios()){
            historialTrabajoService.registrarIngresoProyecto(
                    usuario, proyecto, equipos, "Asignado al proyecto " + proyecto.getNombre()
            );
        }
        return ProyectoMapper.toDto(proyecto);
    }

    @Override
    public ProyectoResponseDto obtenerProyectoPorId(Integer idProyecto) {
        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
        return ProyectoMapper.toDto(proyecto);
    }

    public List<ProyectoResponseDto> listarProyectos() {
        return proyectoRepository.findAll().stream()
                .map(ProyectoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public ProyectoResponseDto actualizarProyectos(Integer idProyecto, ProyectoRequestDto requestDto) {

        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        Equipos equipoAnterior = proyecto.getEquipos();
        var usuariosAntes = equipoAnterior != null ? new HashSet<>(equipoAnterior.getUsuarios())
                : new HashSet<Usuario>();



        proyecto.setNombre(requestDto.getNombre());
        proyecto.setDescripcion(requestDto.getDescripcion());
        proyecto.setFechaInicio(requestDto.getFechaInicio());
        proyecto.setFechaLimite(requestDto.getFechaLimite());
        proyecto.setEstado(requestDto.getEstado());

        Equipos equipos = equiposRepository.findById(requestDto.getIdEquipo())
                        .orElseThrow(()-> new RuntimeException("Equipo no encontrado"));
        proyecto.setEquipos(equipos);
        proyecto.setLiderEquipo(equipos.getLider());

        if (requestDto.getTecnologiasIds() != null) {
            List<Tecnologias> lista =
                    tecnologiaProyectoRepository.findAllById(requestDto.getTecnologiasIds());
            proyecto.setTecnologias(new HashSet<>(lista));
        }

        if(equipoAnterior !=null && equipoAnterior.getIdEquipo().equals(equipos.getIdEquipo())){
            proyectoRepository.save(proyecto);
            return ProyectoMapper.toDto(proyecto);
        }

        Clientes clientes = clientesRepository.findById(requestDto.getIdCliente())
                        .orElseThrow(()-> new RuntimeException("Cliente no encontrado"));
        proyecto.setClientes(clientes);

        if (requestDto.getTecnologiasIds()!=null){
            List<Tecnologias> lista = tecnologiaProyectoRepository.findAllById(requestDto.getTecnologiasIds());
            proyecto.setTecnologias(new HashSet<>(lista));
        }

        proyectoRepository.save(proyecto);

        var usuariosDespues = new HashSet<>(equipos.getUsuarios());

        for(Usuario usuario : usuariosDespues){

            if(!usuariosAntes.contains(usuario)){
                historialTrabajoService.registrarIngresoProyecto(
                        usuario, proyecto, equipos, "Asignado al proyecto "+ proyecto.getNombre()
                );
            }
        }

        for (Usuario usuario : usuariosAntes){
            if(!usuariosDespues.contains(usuario)){
                historialTrabajoService.registrarSalidaProyecto(usuario);
            }
        }

        return ProyectoMapper.toDto(proyecto);
    }

    @Transactional
    @Override
    public void eliminarProyecto(Integer idProyecto) {
        Proyecto proyecto = proyectoRepository.findById(idProyecto)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        Equipos equipos = proyecto.getEquipos();

        if(equipos != null){
            for(Usuario usuario : equipos.getUsuarios()){
                historialTrabajoService.registrarSalidaProyecto(usuario);
            }
        }
        proyectoRepository.delete(proyecto);
    }

}
