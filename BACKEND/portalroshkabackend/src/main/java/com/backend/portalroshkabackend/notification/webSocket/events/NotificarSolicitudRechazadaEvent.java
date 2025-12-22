package com.backend.portalroshkabackend.notification.webSocket.events;

import com.backend.portalroshkabackend.DTO.notification.NotificationDTO;

public class NotificarSolicitudRechazadaEvent implements Notification {

    @Override
    public NotificationDTO getMessageDTO() {

        NotificationDTO dto = new NotificationDTO();

        dto.setMessage("Solicitud Rechazada");

        return dto;
    }
}
