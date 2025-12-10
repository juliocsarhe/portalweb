package com.backend.portalroshkabackend.notification.webSocket.events;

public class NotificarSolicitudAprobadaEvent implements Notification{

    @Override
    public String getMessage() {
        return "SOLICITUD APROBADA";
    }

}
