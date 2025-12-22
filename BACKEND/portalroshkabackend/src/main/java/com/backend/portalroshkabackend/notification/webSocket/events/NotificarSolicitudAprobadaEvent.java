package com.backend.portalroshkabackend.notification.webSocket.events;

import com.backend.portalroshkabackend.DTO.notification.NotificationDTO;

public class NotificarSolicitudAprobadaEvent implements Notification{


    @Override
    public NotificationDTO getMessageDTO() {

        NotificationDTO dto = new NotificationDTO();

        dto.setMessage("Solicitud Aprobada");

        return dto;
    }
}
