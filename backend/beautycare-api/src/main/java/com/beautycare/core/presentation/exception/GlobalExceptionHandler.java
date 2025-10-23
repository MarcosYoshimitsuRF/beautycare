package com.beautycare.core.presentation.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> body = Map.of(
                "status", HttpStatus.BAD_REQUEST.value(),
                "error", "Validation Failed",
                "messages", ex.getBindingResult().getFieldErrors().stream()
                        .map(error -> error.getField() + ": " + error.getDefaultMessage())
                        .collect(Collectors.toList())
        );
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEntityNotFound(EntityNotFoundException ex) {
        Map<String, Object> body = Map.of(
                "status", HttpStatus.NOT_FOUND.value(),
                "error", "Resource Not Found",
                "message", ex.getMessage()
        );
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessRuleException(BusinessRuleException ex) {
        Map<String, Object> body = Map.of(
                "status", HttpStatus.BAD_REQUEST.value(), // 400 Bad Request
                "error", "Business Rule Violation",
                "message", ex.getMessage()
        );
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> body = Map.of(
                "status", HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "error", "Internal Server Error",
                "message", ex.getMessage()
        );
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}