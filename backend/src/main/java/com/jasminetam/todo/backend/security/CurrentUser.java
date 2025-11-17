package com.jasminetam.todo.backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class CurrentUser {

    private static final Logger log = LoggerFactory.getLogger(CurrentUser.class);

    public UUID id() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new IllegalStateException("Unauthenticated: no Authentication in SecurityContext");
        }
        if (!(auth instanceof JwtAuthenticationToken jwtAuth)) {
            throw new IllegalStateException("Unexpected authentication type: " + auth.getClass().getName());
        }

        String subject = jwtAuth.getToken().getSubject();

        try {
            return UUID.fromString(subject);
        } catch (IllegalArgumentException ex) {
            log.error("Expected JWT subject to be a UUID, but got: '{}'", subject);
            throw new IllegalStateException("Invalid user id in JWT subject", ex);
        }
    }
}
