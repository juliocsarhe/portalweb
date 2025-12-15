package com.backend.portalroshkabackend.notification.webSocket;

import com.backend.portalroshkabackend.notification.webSocket.events.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;


@Component
public class WebSocketNotificationListener {

    @Autowired
    private SimpMessagingTemplate template;

    @EventListener
    public void onNotification( Notification notification) {
        System.out.println("DTO = " + notification.getMessageDTO());//para ver si es null o no

        template.convertAndSend("/topic/" + notification.getClass().getSimpleName().toLowerCase(), notification.getMessageDTO());
        System.out.println("Evento recibido: " + notification.getMessageDTO());

        System.out.println("Clase (simple): " + notification.getClass().getSimpleName());
    }
}
