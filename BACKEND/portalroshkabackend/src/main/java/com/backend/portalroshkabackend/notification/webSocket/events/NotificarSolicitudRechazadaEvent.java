package com.backend.portalroshkabackend.notification.webSocket.events;

import com.backend.portalroshkabackend.DTO.notification.NotificationDTO;

public class NotificarSolicitudRechazadaEvent implements Notification {

    private int id;

    public NotificarSolicitudRechazadaEvent(int id) {

        this.id = id;

    }

    @Override
    public NotificationDTO getMessageDTO() {
        NotificationDTO dto = new NotificationDTO();

        dto.setIdUsuario(id); ;

        dto.setMessage("Solicitud Rechazada");

        return dto;
    }
}
