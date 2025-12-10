package com.backend.portalroshkabackend.notification.webSocket.events;



public class NotificarSolicitudThEvent implements Notification {

    @Override
    public String getMessage() {
        return "SOLICITUD CREADA";
    }

}
