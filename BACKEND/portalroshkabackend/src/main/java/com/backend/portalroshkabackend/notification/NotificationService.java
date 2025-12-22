package com.backend.portalroshkabackend.notification;

import com.backend.portalroshkabackend.Models.Solicitud;
import com.backend.portalroshkabackend.Models.Usuario;
import com.backend.portalroshkabackend.Services.UsuariosService;
import com.backend.portalroshkabackend.notification.aws.NotificacitionServiceAws;
import com.backend.portalroshkabackend.notification.webSocket.events.Notification;
import com.backend.portalroshkabackend.notification.ses.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
    private NotificacitionServiceAws snsService; // SNS
    private EmailService emailService;

    @Autowired
    public NotificationService(UsuariosService usuariosService,
                               SimpMessagingTemplate template,
                               NotificacitionServiceAws  snsService,
                               EmailService emailService) {
        this.usuariosService = usuariosService;
        this.template = template;
        this.snsService = snsService;
        this.emailService = emailService;

    }

    @Value("${correo.th}")
    private String correoTH;

    @Value("${correo.sa}")
    private String correoSA;

    public void sendNotificationToTeamLeader(Solicitud solicitud, String correo) {

        String username = solicitud.getUsuario().getNombre() + " " + solicitud.getUsuario().getApellido();
        String message = "BIENVENIDO A PORTAL ROSHKA" + ".\n\n"
                + username + " realizo una solicitud: " + solicitud.getTipoSolicitud().toString().toLowerCase() + ",\n\n"
                + "Saludos,\n"
                + "Equipo Portal Roshka";

        System.out.println("ENVIANDO CORREO AL LIDER");


        emailService.sendEmailToUser(correo, "NUEVA SOLICITUD RECIBIDA", message);


    }

    public void sendNotificationToTH(Solicitud solicitud) {

        String username = solicitud.getUsuario().getNombre() + " " + solicitud.getUsuario().getApellido();
        String message = "BIENVENIDO A PORTAL ROSHKA" + ",\n\n"
                + username + " realizo una solicitud: " + solicitud.getTipoSolicitud().toString().toLowerCase() + ".\n\n"
                + "Saludos,\n"
                + "Equipo Portal Roshka";

        System.out.println("Enviando correo a TH" + correoTH);
        emailService.sendEmailToUser(correoTH, "NUEVA SOLICITUD", message);

    }

    public void sendNotificationToSys (Solicitud  solicitud) {

        String username = solicitud.getUsuario().getNombre() + " " + solicitud.getUsuario().getApellido();
        String message = "BIENVENIDO A PORTAL ROSHKA" + ".\n\n"
                + username + " realizo una solicitud: " + solicitud.getTipoSolicitud().toString().toLowerCase() + ".\n\n"
                + "Saludos,\n"
                + "Equipo Portal Roshka";

        emailService.sendEmailToUser(correoSA, "NUEVA SOLICITUD", message);

    }

    public void alertTH (Solicitud solicitud, boolean aprobado ) {

        String username = solicitud.getUsuario().getNombre() + " " + solicitud.getUsuario().getApellido();
        String message = aprobado ? "Al usuario " + username + " se la ha aprobado la solicitud " + solicitud.getTipoSolicitud().toString().toLowerCase()
                : "Al usuario " + username + " se la ha rechazado la solicitud " + solicitud.getTipoSolicitud().toString().toLowerCase();

        emailService.sendEmailToUser(correoTH, "Solicitud aprobada por un Team Lider", message );

    }

    public void notifyUser(Solicitud solicitud, boolean aprobado) {
        String message = aprobado ? "Solicitud aprobada" : "Solicitud rechazada";
        String usuarioCorreo = solicitud.getUsuario().getCorreo();

        template.convertAndSendToUser(usuarioCorreo, "/topic/notification", message); //WebSocket
        snsService.sendSolicitudNotification(message); //SNS

    }

    public void notifyUserses(Solicitud solicitud, boolean aprobado) {
        String usuarioCorreo = solicitud.getUsuario().getCorreo();
        String message = aprobado ? "BIENVENIDO A PORTAL ROSHKA" + ".\n\n" +
                "Tu solicitud de " + solicitud.getTipoSolicitud().toString().toLowerCase() + " ha sido aprobada." + "\n\n"
                + "Saludos,\n"
                + "Equipo Portal Roshka"
                : "BIENVENIDO A PORTAL ROSHKA" + ".\n\n" +
                "Tu solicitud de " + solicitud.getTipoSolicitud().toString().toLowerCase() + " ha sido rechazada." + "\n\n"
                + "Saludos,\n"
                + "Equipo Portal Roshka";
        String tipoSolicitud = solicitud.getTipoSolicitud().toString().toLowerCase();

        System.out.println("ENVIANDO CORREO...");

        emailService.sendEmailToUser(usuarioCorreo, "Estado de solicitud de " + tipoSolicitud, message);
    }

    public void sendPassword(Usuario usuario, String password) {
        String usuarioCorreo = usuario.getCorreo();
        String message = "Bienvenido al Portal Roshka\n\n" +
                "Hola " + usuarioCorreo + ",\n\n" +
                "Se ha creado tu cuenta en el Portal Roshka. A continuación tus credenciales de acceso temporales:\n\n" +
                "Usuario: " + usuario.getCorreo() + "\n" +
                "Contraseña temporal: " + password + "\n\n" +
                "Importante: Esta contraseña es temporal y puedes cambiarla en tu primer inicio de sesión.\n\n" +
                "Si no solicitaste esta cuenta, ignora este correo.\n\n" +
                "Saludos,\n" +
                "Equipo Portal Roshka";

        if (emailService != null) {
            emailService.sendEmailToUser(usuarioCorreo,
                    "Acceso al Portal Roshka: Credenciales Temporales",
                    message);
        }
    }

}
