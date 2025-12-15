package com.backend.portalroshkabackend.notification.webSocket.events;


import com.backend.portalroshkabackend.DTO.notification.NotificationDTO;

public class NotificarSolicitudThEvent implements Notification {

    private int id;

    public NotificarSolicitudThEvent(int id) {
        this.id = id;
    }

    @Override
    public NotificationDTO getMessageDTO() {
        NotificationDTO dto = new NotificationDTO();

        dto.setIdUsuario(id); ;

        dto.setMessage("Solicitud Rechazada por TH");

        return dto;
    }
}
