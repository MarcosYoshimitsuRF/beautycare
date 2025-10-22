package com.beautycare.inventory.presentation.exception;

/**
 * Excepción personalizada para validaciones de negocio (ej. stock).
 */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}