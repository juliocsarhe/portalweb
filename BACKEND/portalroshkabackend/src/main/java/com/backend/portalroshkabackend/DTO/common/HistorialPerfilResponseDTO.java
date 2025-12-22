package com.backend.portalroshkabackend.DTO.common;


import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data

public class HistorialPerfilResponseDTO {

    private String proyecto;
    private String equipo;
    private String lider;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String descripcion;
    private List<String> tecnologias;

}
