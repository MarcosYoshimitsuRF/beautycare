package com.beautycare.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${services.inventory.url}")
    private String inventoryServiceUrl;

    @Bean
    public WebClient inventoryWebClient() {
        return WebClient.builder()
                .baseUrl(inventoryServiceUrl)
                .build();
    }
}