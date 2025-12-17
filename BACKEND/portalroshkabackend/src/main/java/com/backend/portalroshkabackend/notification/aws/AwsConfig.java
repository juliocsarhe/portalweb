package com.backend.portalroshkabackend.notification.aws;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sns.SnsClient;

@Profile("prod")
@Configuration
public class AwsConfig {


    @Bean
    public SnsClient snsClient(){
        return SnsClient.builder()
                .region(Region.SA_EAST_1)
                .build();
    }

}
