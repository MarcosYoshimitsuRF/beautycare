package com.beautycare.core.config;

import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.ws.config.annotation.EnableWs;
import org.springframework.ws.transport.http.MessageDispatcherServlet;
import org.springframework.ws.wsdl.wsdl11.DefaultWsdl11Definition;
import org.springframework.xml.xsd.SimpleXsdSchema;
import org.springframework.xml.xsd.XsdSchema;

@EnableWs // Habilita Spring Web Services
@Configuration
public class WebServiceConfig {

    // 1. Bean que registra el Servlet de Spring WS
    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(ApplicationContext context) {
        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(context);
        servlet.setTransformWsdlLocations(true);
        // Define la URL donde escuchará el servlet SOAP
        return new ServletRegistrationBean<>(servlet, "/soap-ws/*");
    }

    // 2. Bean que define el WSDL [fuente: 76]
    // Nombre del bean ('clientes') coincide con el WSDL (clientes.wsdl)
    @Bean(name = "clientes")
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema clientesSchema) {
        DefaultWsdl11Definition wsdlDefinition = new DefaultWsdl11Definition();
        wsdlDefinition.setPortTypeName("ClientesPort");
        // URL del servicio (coincide con el servlet)
        wsdlDefinition.setLocationUri("/soap-ws");
        // Target Namespace (definido en el XSD)
        wsdlDefinition.setTargetNamespace("http://beautycare.com/core/soap/ws");
        wsdlDefinition.setSchema(clientesSchema);
        return wsdlDefinition;
    }

    // 3. Bean que carga el XSD desde el classpath
    @Bean
    public XsdSchema clientesSchema() {
        return new SimpleXsdSchema(new ClassPathResource("soap-ws/clientes.xsd"));
    }
}