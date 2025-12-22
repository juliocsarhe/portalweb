//package com.backend.portalroshkabackend.DTO.Operationes;
//
//import com.backend.portalroshkabackend.Models.Proyecto;
//import com.backend.portalroshkabackend.Models.Tecnologias;
//import com.backend.portalroshkabackend.Models.Usuario;
//import lombok.Data;
//
//import java.time.LocalDate;
//import java.util.List;
//@Deprecated
//@Data
//public class ProyectoDTO_viejo {
//
//    private Integer idProyecto;
//    private String nombre;
//    private Integer idLiderEquipo;
//    private String nombreLider;
//    private Integer idEquipoAsignado;
//    private List<Integer> usuariosAsignadosId;
//    private Tecnologias tecnologias;
//    private String descripcion;
//    private LocalDate fechaInicio;
//    private LocalDate fechaLimite;
//    private List<Integer> equipoId;
//    private Proyecto.EstadoProyectoEnum estado;
//    private Boolean activo;
//
//
//    public static ProyectoDTO_viejo fromEntity(Proyecto p) {
//
//        ProyectoDTO_viejo dto = new ProyectoDTO_viejo();
//
//        dto.setIdProyecto(p.getIdProyecto());
//        dto.setNombre(p.getNombre());
//
//        dto.setIdLiderEquipo(p.getLiderEquipo().getIdUsuario());
//        dto.setNombreLider(p.getLiderEquipo().getNombre());
//
//        dto.setIdEquipoAsignado(
//                p.getEquipoAsignado() != null
//                        ? p.getEquipoAsignado().getIdEquipo()
//                        : null
//        );
//
//        dto.setUsuariosAsignadosId(
//                p.getUsuariosAsignados()
//                        .stream()
//                        .map(Usuario::getIdUsuario)
//                        .toList()
//        );
//
//        dto.setTecnologias(p.getTecnologias());
//        dto.setDescripcion(p.getDescripcion());
//        dto.setFechaInicio(p.getFechaInicio());
//        dto.setFechaLimite(p.getFechaLimite());
//        dto.setEstado(p.getEstado());
//        dto.setActivo(p.getActivo());
//
//        return dto;
//    }
//
//    public Proyecto toEntity() {
//
//        Proyecto p = new Proyecto();
//
//        p.setIdProyecto(this.idProyecto);
//        p.setNombre(this.nombre);
//        p.setTecnologias(this.tecnologias);
//        p.setDescripcion(this.descripcion);
//        p.setFechaInicio(this.fechaInicio);
//        p.setFechaLimite(this.fechaLimite);
//        p.setEstado(this.estado != null ? this.estado : Proyecto.EstadoProyectoEnum.ACTIVO);
//        p.setActivo(this.activo != null ? this.activo : true);
//
//        return p;
//    }
//}
