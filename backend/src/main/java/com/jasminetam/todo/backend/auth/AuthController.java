package com.jasminetam.todo.backend.auth;

import com.jasminetam.todo.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/exchange")
    public ResponseEntity<Map<String, String>> exchange(@RequestBody ExchangeRequest req) {
        String token = authService.exchange(
                req.email(),
                req.name(),
                req.avatarUrl(),
                req.provider(),
                req.providerAccountId()
        );

        return ResponseEntity.ok(Map.of("accessToken", token));
    }

    public record ExchangeRequest(
            String email,
            String name,
            String avatarUrl,
            String provider,
            String providerAccountId
    ) {}
}
