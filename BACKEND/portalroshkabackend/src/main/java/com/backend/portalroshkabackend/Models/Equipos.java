package com.backend.portalroshkabackend.Models;

import java.time.LocalDate;
// import java.util.List;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import com.backend.portalroshkabackend.Models.Enum.EstadoActivoInactivo;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.OneToMany;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
// import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@Table(name = "equipos")
public class Equipos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_equipo")
    private Integer idEquipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_lider", nullable = false)
    private Usuario lider;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "id_cliente")
    //private Clientes cliente;

   // @Column(name = "fecha_inicio")
    //private LocalDate fechaInicio;

   // @Column(name = "fecha_limite")
   // private LocalDate fechaLimite;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

//    @ManyToMany(fetch = FetchType.LAZY)
//    @JoinTable(
//        name = "tecnologias_equipos",
//        joinColumns = @JoinColumn(name = "id_equipo"),
//        inverseJoinColumns = @JoinColumn(name = "id_tecnologia")
//    )
//    private Set<Tecnologias> tecnologias = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", columnDefinition = "estado_ac_enum")
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private EstadoActivoInactivo estado = EstadoActivoInactivo.A;

    // Un equipo tiene muchos usuarios, un usuario puede estar en varios equipos
    @ManyToMany
    @JoinTable(
            name = "equipo_usuarios",
            joinColumns = @JoinColumn(name = "id_equipo"),
            inverseJoinColumns = @JoinColumn(name = "id_usuario")
    )
    private Set<Usuario> usuarios = new HashSet<>();

    // @OneToMany(mappedBy = "equipo", fetch = FetchType.LAZY)
    // private List<AsignacionUsuarioEquipo> asignacionesUsuario = new ArrayList<>();
}
