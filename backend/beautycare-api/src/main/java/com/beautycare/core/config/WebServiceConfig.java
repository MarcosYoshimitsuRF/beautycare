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

    @Bean
    public ServletRegistrationBean<MessageDispatcherServlet> messageDispatcherServlet(ApplicationContext context) {
        MessageDispatcherServlet servlet = new MessageDispatcherServlet();
        servlet.setApplicationContext(context);
        servlet.setTransformWsdlLocations(true);
        return new ServletRegistrationBean<>(servlet, "/soap-ws/*");
    }

    @Bean(name = "clientes")
    public DefaultWsdl11Definition defaultWsdl11Definition(XsdSchema clientesSchema) {
        DefaultWsdl11Definition wsdlDefinition = new DefaultWsdl11Definition();
        wsdlDefinition.setPortTypeName("ClientesPort");
        wsdlDefinition.setLocationUri("/soap-ws");
        wsdlDefinition.setTargetNamespace("http://beautycare.com/core/soap/ws");
        wsdlDefinition.setSchema(clientesSchema);
        return wsdlDefinition;
    }

    //Bean que carga el XSD desde el classpath
    @Bean
    public XsdSchema clientesSchema() {
        return new SimpleXsdSchema(new ClassPathResource("soap-ws/clientes.xsd"));
    }
}