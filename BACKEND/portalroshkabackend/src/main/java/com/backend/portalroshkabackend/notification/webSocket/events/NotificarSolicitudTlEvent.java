package com.backend.portalroshkabackend.notification.webSocket.events;

import com.backend.portalroshkabackend.DTO.notification.NotificationDTO;

public class NotificarSolicitudTlEvent implements Notification {

    private int id;

    public NotificarSolicitudTlEvent(int id){

        this.id = id;
    }


    @Override
    public NotificationDTO getMessageDTO () {
        NotificationDTO dto = new NotificationDTO();

        dto.setIdUsuario(id);
        dto.setMessage("Nueva Solicitud");

        return dto;
    }
}
