package com.backend.portalroshkabackend.tools.security;

import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import com.backend.portalroshkabackend.tools.errors.errorslist.user.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    public static final int ROLE_TALENTO_HUMANO = 1;
    public static final int ROLE_OPERACIONES = 2;
    public static final int ROLE_SYSADMIN = 3;
    public static final int ROLE_DESARROLLO = 4;
    public static final int ROLE_DIRECTORES = 5;
    public static final int ROLE_TEAM_LIDER = 6;
    //TODO: pasar roles a enum

    private final UsuarioRepository usuarioRepository;

    public Usuario getUsuarioActual() {
        String correo = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> UserNotFoundException.byCorreo(correo));
    }

    public boolean hasRole(Usuario usuario, int rolId) {
        return usuario.getRol() != null
                && usuario.getRol().getIdRol().equals(rolId);
    }


}
