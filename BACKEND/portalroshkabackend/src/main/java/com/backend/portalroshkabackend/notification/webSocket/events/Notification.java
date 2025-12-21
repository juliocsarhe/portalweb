package com.backend.portalroshkabackend.notification.webSocket.events;

import com.backend.portalroshkabackend.DTO.notification.NotificationDTO;

public interface Notification {

    NotificationDTO getMessageDTO();

}
