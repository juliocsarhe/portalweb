package com.backend.portalroshkabackend.notification.webSocket.events;

import com.backend.portalroshkabackend.DTO.notification.NotificationDTO;

public class NotificarSolicitudAprobadaEvent implements Notification{

    private int id;

    public NotificarSolicitudAprobadaEvent(int id) {
        this.id = id;
    }

    @Override
    public NotificationDTO getMessageDTO() {

        NotificationDTO dto = new NotificationDTO();

        dto.setIdUsuario(id); ;

        dto.setMessage("Solicitud Aprobada");

        return dto;
    }
}
