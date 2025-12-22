package com.backend.portalroshkabackend.Controllers.Operations;

import com.backend.portalroshkabackend.DTO.th.employees.UserResponseDto;
import com.backend.portalroshkabackend.Services.HumanResource.IEmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/operations")
public class OperationsUserController {

    private final IEmployeeService employeeService;

    @Autowired
    public OperationsUserController(IEmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/usuarios-disponibles")
    public ResponseEntity<List<UserResponseDto>> getUsuariosDisponibles() {

        // Llamar al método existente — sin filtros
        Page<UserResponseDto> page = employeeService.getAllEmployeesByFilters(
                null, null, null,
                Pageable.unpaged()
        );

        List<UserResponseDto> usuarios = page.getContent();

        // Filtrar roles NO permitidos
        List<UserResponseDto> filtrados = usuarios.stream()
                .filter(u -> u.getIdRol() != 1) // TH
                .filter(u -> u.getIdRol() != 3) // SYSADMIN
                .filter(u -> u.getIdRol() != 5) // DIRECTORES
                .toList();

        return ResponseEntity.ok(filtrados);
    }
}
