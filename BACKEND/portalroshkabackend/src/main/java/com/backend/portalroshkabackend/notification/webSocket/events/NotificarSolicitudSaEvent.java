package com.backend.portalroshkabackend.notification.webSocket.events;

public class NotificarSolicitudSaEvent implements Notification{

    @Override
    public String getMessage() {
        return "SOLICITUD DE DISPOSITIVO NUEVA";
    }

}
