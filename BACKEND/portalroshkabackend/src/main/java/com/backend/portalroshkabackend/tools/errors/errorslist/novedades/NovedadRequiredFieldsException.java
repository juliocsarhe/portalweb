package com.backend.portalroshkabackend.tools.errors.errorslist.novedades;

public class NovedadRequiredFieldsException extends RuntimeException{
    public NovedadRequiredFieldsException(){
        super("Título y descripción son obligatorios.");
    }
}
