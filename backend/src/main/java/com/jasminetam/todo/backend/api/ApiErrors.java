package com.jasminetam.todo.backend.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.NoSuchElementException;

@RestControllerAdvice
public class ApiErrors {
    public record Err(String message) {}

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Err> notFound(NoSuchElementException ex) {
        return ResponseEntity.status(404).body(new Err("Not found"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Err> badRequest(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest().body(new Err("Validation failed"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Err> forbidden(AccessDeniedException ex) {
        return ResponseEntity.status(403).body(new Err("Forbidden"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Err> generic(Exception ex) {
        return ResponseEntity.status(500).body(new Err("Unexpected error"));
    }
}
