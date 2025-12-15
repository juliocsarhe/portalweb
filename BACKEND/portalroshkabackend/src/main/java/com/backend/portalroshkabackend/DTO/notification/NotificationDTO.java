package com.backend.portalroshkabackend.DTO.notification;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NotificationDTO {

    public int id;
    public int idSolicitud;
    public String message;

}
