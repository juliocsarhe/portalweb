package com.backend.portalroshkabackend.notification.webSocket.events;

import com.backend.portalroshkabackend.DTO.notification.NotificationDTO;
import com.backend.portalroshkabackend.Models.Enum.SolicitudesEnum;

public class NotificarSolicitudTlEvent implements Notification {

    private final SolicitudesEnum tipoSolicitud;

    public NotificarSolicitudTlEvent(SolicitudesEnum tipoSolicitud) {
        this.tipoSolicitud = tipoSolicitud;
    }

    @Override
    public NotificationDTO getMessageDTO () {
        NotificationDTO dto = new NotificationDTO();

        String mensaje = "Nueva solicitud de " + tipoSolicitud.name().toLowerCase();

        dto.setMessage(mensaje);

        return dto;
    }
}
