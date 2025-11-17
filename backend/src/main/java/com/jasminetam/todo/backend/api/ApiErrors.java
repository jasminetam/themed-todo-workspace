package com.jasminetam.todo.backend.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

@RestControllerAdvice
public class ApiErrors {

    private static final Logger log = LoggerFactory.getLogger(ApiErrors.class);

    public record Err(String message) {}

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Err> notFound(NoSuchElementException ex) {
        log.warn("Not found error", ex);
        return ResponseEntity.status(404).body(new Err("Not found"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Err> badRequest(MethodArgumentNotValidException ex) {
        log.warn("Validation failed", ex);
        return ResponseEntity.badRequest().body(new Err("Validation failed"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Err> forbidden(AccessDeniedException ex) {
        log.warn("Forbidden error", ex);
        return ResponseEntity.status(403).body(new Err("Forbidden"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Err> generic(Exception ex) {
        log.error("Unexpected error during request", ex);
        return ResponseEntity.status(500).body(new Err("Unexpected error"));
    }
}
