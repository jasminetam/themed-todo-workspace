package com.jasminetam.todo.backend.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
public class JwtService {

    private final JwtEncoder encoder;
    private final String issuer;
    private final long accessMinutes;

    public JwtService(
            JwtEncoder encoder,
            @Value("${jwt.issuer:http://localhost:8080}") String issuer,
            @Value("${jwt.access-minutes:60}") long minutes
    ) {
        this.encoder = encoder;
        this.issuer = issuer;
        this.accessMinutes = minutes;
    }

    public String issue(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessMinutes * 60);

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuer(issuer)
                .subject(subject)
                .issuedAt(now)
                .expiresAt(exp)
                .claims(map -> map.putAll(claims))
                .build();

        JwsHeader headers = JwsHeader.with(MacAlgorithm.HS256).build();
        JwtEncoderParameters params = JwtEncoderParameters.from(headers, claimsSet);

        return encoder.encode(params).getTokenValue();
    }
}
