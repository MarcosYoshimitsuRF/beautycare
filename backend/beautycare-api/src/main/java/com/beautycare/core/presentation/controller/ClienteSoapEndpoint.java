package com.beautycare.core.presentation.controller;

import com.beautycare.core.application.ClienteService;
// Importamos las clases JAXB generadas por el plugin
import com.beautycare.core.soap.ws.ConsultarEstadoClienteRequest;
import com.beautycare.core.soap.ws.ConsultarEstadoClienteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

@Endpoint
@RequiredArgsConstructor
public class ClienteSoapEndpoint {

    private static final String NAMESPACE_URI = "http://beautycare.com/core/soap/ws";

    private final ClienteService clienteService;

    /**
     * Maneja la solicitud 'consultarEstadoClienteRequest'
     * definida en el XSD.
     */
    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "consultarEstadoClienteRequest")
    @ResponsePayload // Indica que el retorno es el cuerpo de la respuesta SOAP
    public ConsultarEstadoClienteResponse consultarEstadoCliente(@RequestPayload ConsultarEstadoClienteRequest request) {

        // ógica de negocio
        String estado = clienteService.consultarEstadoClienteSoap(request.getClienteId());

        //Construir la respuesta JAXB
        ConsultarEstadoClienteResponse response = new ConsultarEstadoClienteResponse();
        response.setEstado(estado);

        return response;
    }
}