package com.backend.portalroshkabackend.tools.errors.errorslist.novedades;

public class NovedadesUserNotFoundException extends RuntimeException {
    public NovedadesUserNotFoundException() {

      super("Usuario autenticado no encontrado.");
    }
}
