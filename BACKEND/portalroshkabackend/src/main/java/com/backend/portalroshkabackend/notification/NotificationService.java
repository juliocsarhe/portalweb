package com.backend.portalroshkabackend.notification;

import com.backend.portalroshkabackend.Models.Solicitud;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Services.UsuariosService;
import com.backend.portalroshkabackend.notification.webSocket.events.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private ApplicationEventPublisher publisher;

    public void sendEvent(Notification notification) {
        publisher.publishEvent(notification);
    }

    private UsuariosService usuariosService;
    private SimpMessagingTemplate template; // WebSocket

    @Autowired
    public NotificationService(UsuariosService usuariosService,
                               SimpMessagingTemplate template) {
        this.usuariosService = usuariosService;
        this.template = template;
    }

    public void sendNotificationToTeamLeader(Solicitud solicitud, String correo) {
        System.out.println("ENVIANDO NOTIFICACION AL LIDER (Simulado)");
    }

    public void sendNotificationToTH(Solicitud solicitud) {
        System.out.println("Enviando notificacion a TH (Simulado)");
    }

    public void sendNotificationToSys(Solicitud solicitud) {
        System.out.println("Enviando notificacion a SysAdmin (Simulado)");
    }

    public void alertTH(Solicitud solicitud, boolean aprobado) {
        System.out.println("Alertando a TH (Simulado)");
    }

    public void notifyUser(Solicitud solicitud, boolean aprobado) {
        String message = aprobado ? "Solicitud aprobada" : "Solicitud rechazada";
        String usuarioCorreo = solicitud.getUsuario().getCorreo();
        template.convertAndSendToUser(usuarioCorreo, "/topic/notification", message); //WebSocket
    }

    public void notifyUserses(Solicitud solicitud, boolean aprobado) {
        System.out.println("ENVIANDO CORREO (Simulado)...");
    }

    public void sendPassword(Usuario usuario, String password) {
        System.out.println("Enviando password a usuario (Simulado)");
    }
}
