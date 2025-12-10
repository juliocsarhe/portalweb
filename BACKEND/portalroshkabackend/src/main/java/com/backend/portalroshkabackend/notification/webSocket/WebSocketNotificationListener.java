package com.backend.portalroshkabackend.notification.webSocket;

import com.backend.portalroshkabackend.notification.webSocket.events.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;



@Component
public class WebSocketNotificationListener {

    @Autowired
    private SimpMessagingTemplate template;

    @EventListener
    public void onNotification( Notification notification ) {
        template.convertAndSend("/topic/" + notification.getClass().getSimpleName().toLowerCase() , notification.getMessage());
        System.out.println("Evento recibido: " + notification.getMessage());

        System.out.println("Clase (simple): " + notification.getClass().getSimpleName());

    }
}
