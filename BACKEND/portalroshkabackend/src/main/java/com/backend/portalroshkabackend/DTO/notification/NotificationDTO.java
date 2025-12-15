package com.backend.portalroshkabackend.DTO.notification;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NotificationDTO {

    public int idUsuario;
    public int idSolicitud;
    public String message;

}
