package com.backend.portalroshkabackend.notification.webSocket.events;

public class NotificarSolicitudRechazadaEvent implements Notification {

    @Override
    public String getMessage() {
        return "SOLICIUD RECHAZADA";
    }

}
