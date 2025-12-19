package com.backend.portalroshkabackend.notification.aws;

import com.backend.portalroshkabackend.Models.Solicitud;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sns.SnsClient;


@Profile("Prod")
@Service
public class NotificacitionServiceAws {

    @Autowired
    private SnsClient snsClient;

    @Autowired
    private UsuarioRepository usuarioRepository;


    @Value("${topic.solicitud}")
    private String TOPIC_SOLICITUD;

    @Value("${TOPIC.notificacion}")
    private String TOPIC_NOTIFICACION;

    private void subscribeEmailToTopic(String correo) {

        System.out.println(">>> LLAMANDO A SUBSCRIBE() EN SNS !!!");

        snsClient.subscribe(p -> p
                .protocol("email")
                .endpoint(correo)
                .topicArn(TOPIC_SOLICITUD)
        );
    }

    public void subscribeNewUserToTopic(String correo) {
        System.out.println(">>> SNS SUSCRIBIENDO CORREO: " + correo);

        subscribeEmailToTopic(correo);
    }


    public void sendSolicitudNotification(String mensaje) {

        // Enviar el mensaje solo a los usuarios que ya están suscritos
        snsClient.publish(p -> p
                .topicArn(TOPIC_SOLICITUD)  // El ARN del topic de solicitudes
                .message(mensaje)           // El mensaje que se enviará
        );
    }


    public void sendNotificationToTeamLeader (Solicitud solicitud) {
        String message = "Nueva Solicitud pendiende: " + solicitud.getIdSolicitud();

        snsClient.publish(p -> p
                .topicArn(TOPIC_NOTIFICACION)
                .message(message));
    }


}
