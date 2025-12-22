package com.backend.portalroshkabackend.DTO.Usuario;

import java.math.BigDecimal;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class tiposBeneficiosDto {
    
    private Integer idTipoBeneficio;

    private String nombre;
    
    private String descripcion;

    private BigDecimal montoMaximo;
}
