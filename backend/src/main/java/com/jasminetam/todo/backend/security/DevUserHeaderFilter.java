package com.jasminetam.todo.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class DevUserHeaderFilter extends OncePerRequestFilter {
    public static final String HEADER = "X-User-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String id = req.getHeader(HEADER);
        if (id != null) {
            try {
                UUID.fromString(id); // validate shape
                var auth = new AbstractAuthenticationToken(AuthorityUtils.createAuthorityList("ROLE_USER")) {
                    @Override public Object getCredentials() { return "N/A"; }
                    @Override public Object getPrincipal() { return id; }
                    @Override public boolean isAuthenticated() { return true; }
                };
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (IllegalArgumentException ignored) { /* invalid UUID -> unauthenticated */ }
        }
        chain.doFilter(req, res);
    }
}
