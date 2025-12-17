package com.backend.portalroshkabackend.tools.errors.errorslist.user;

public class UserNotFoundException extends RuntimeException {

    private UserNotFoundException(String message){
        super(message);
    }

    public static UserNotFoundException byId(int id) {
        return new UserNotFoundException("Usuario con ID " + id + " no encontrado.");
    }

    public static UserNotFoundException byCorreo(String correo) {
        return new UserNotFoundException("Usuario con Correo " + correo + " no encontrado.");
    }

    public static UserNotFoundException byCedula(String cedula) {
        return new UserNotFoundException("Usuario con cédula número " + cedula + " no encontrado.");
    }

}