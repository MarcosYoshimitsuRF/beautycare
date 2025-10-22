package com.beautycare.core.presentation.exception;

/**
 * Excepción personalizada para validaciones de reglas de negocio
 * (ej. solapamiento de citas, pagos duplicados).
 */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message);
    }
}