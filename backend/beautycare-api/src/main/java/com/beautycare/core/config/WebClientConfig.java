package com.beautycare.core.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${services.inventory.url}")
    private String inventoryServiceUrl;

    /**
     * Define un bean de WebClient pre-configurado con la URL base
     * del servicio de inventario.
     * WebClient es la herramienta moderna (incluida con Webflux)
     * para realizar llamadas REST.
     */
    @Bean
    public WebClient inventoryWebClient() {
        return WebClient.builder()
                .baseUrl(inventoryServiceUrl)
                .build();
    }
}