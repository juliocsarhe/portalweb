package com.backend.portalroshkabackend.notification.ses;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.sns.SnsClient;

@Configuration
public class SesConfig {

    @Bean
    public SesClient sesClient(){
        return SesClient.builder()
                .region(Region.SA_EAST_1)
                .build();
    }
}


