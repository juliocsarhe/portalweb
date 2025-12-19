package com.backend.portalroshkabackend.notification.ses;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;


@Service
public class EmailService {

    private final SesClient sesClient;

    @Value("${correo.th}")
    private String correoTH;

    @Autowired
    public EmailService(SesClient sesClient){
        this.sesClient = sesClient;
    }

    public void sendEmailToUser (String correo, String subject, String body){
        SendEmailRequest emailRequest = SendEmailRequest.builder()
                .destination(Destination.builder().toAddresses(correo).build()) // Correo del destinatario
                .message(Message.builder()
                        .subject(Content.builder().data(subject).build()) // Asunto
                        .body(Body.builder().text(Content.builder().data(body).build()).build()) // Cuerpo del mensaje
                        .build())
                .source(correoTH)
                .build();

        // Enviar el correo
        sesClient.sendEmail(emailRequest);
    }
}


