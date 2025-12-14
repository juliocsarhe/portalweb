package com.backend.portalroshkabackend.notification.ses;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.sns.SnsClient;

@Profile("prod")
@Configuration
public class SesConfig {

    @Bean
    public SesClient sesClient(){
        return SesClient.builder()
                .region(Region.SA_EAST_1)
                .build();
    }
}


