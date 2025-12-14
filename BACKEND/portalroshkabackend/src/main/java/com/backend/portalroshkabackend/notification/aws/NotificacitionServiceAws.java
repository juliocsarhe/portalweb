package com.backend.portalroshkabackend.notification.aws;

import com.backend.portalroshkabackend.Models.Solicitud;
import com.backend.portalroshkabackend.Repositories.UsuarioRepositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sns.SnsClient;


@Profile("prod")
@Service
public class NotificacitionServiceAws {

    @Autowired
    private SnsClient snsClient;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final String TOPIC_SOLICITUD = "arn:aws:sns:sa-east-1:681721397478:portal-solicitud";
    private final String TOPIC_NOTIFICACION = "arn:aws:sns:sa-east-1:681721397478:portal-notificacion";


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
