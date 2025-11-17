package com.jasminetam.todo.backend.service;

import com.jasminetam.todo.backend.domain.User;
import com.jasminetam.todo.backend.repo.UserRepository;
import com.jasminetam.todo.backend.security.JwtService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepo, JwtService jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }

    /**
     * Exchange an external login (Google / GitHub, etc.) for a backend JWT.
     * Identity is based on email only.
     */
    public String exchange(String email, String name, String avatarUrl, String provider, String providerAccountId) {
        // Find existing user by email, or create new
        User user = userRepo.findByEmail(email)
                .orElseGet(() -> userRepo.save(new User(email, name, avatarUrl)));

        // Build claims for the JWT
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("name", user.getName() != null ? user.getName() : "");
        // Include provider info in the token (from request), not stored in DB
        claims.put("provider", provider != null ? provider : "");
        claims.put("providerAccountId", providerAccountId != null ? providerAccountId : "");

        // sub = backend user id (used as owner_id for workspaces, etc.)
        return jwtService.issue(user.getId().toString(), claims);
    }
}
