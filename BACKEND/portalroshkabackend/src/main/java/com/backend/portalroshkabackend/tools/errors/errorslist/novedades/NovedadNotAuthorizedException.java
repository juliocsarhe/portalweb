package com.backend.portalroshkabackend.tools.errors.errorslist.novedades;

public class NovedadNotAuthorizedException extends RuntimeException {
    public NovedadNotAuthorizedException() {

      super("No esta autorizado para administrar esta novedad");
    }
}
