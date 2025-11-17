package com.jasminetam.todo.backend.config;

import com.jasminetam.todo.backend.security.DevUserHeaderFilter;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Collection;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    /**
     * HS256 encoder using a Base64-encoded secret.
     */
    @Bean
    JwtEncoder jwtEncoder(@Value("${jwt.secret-base64}") String secretBase64) {
        byte[] keyBytes = Base64.getDecoder().decode(secretBase64);
        SecretKey secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");

        JWK jwk = new OctetSequenceKey.Builder(secretKey)
                .algorithm(JWSAlgorithm.HS256)   // alg must match header
                .build();

        JWKSource<SecurityContext> jwkSource =
                new ImmutableJWKSet<>(new JWKSet(jwk));

        return new NimbusJwtEncoder(jwkSource);
    }

    /**
     * HS256 decoder using the same Base64 secret as the encoder.
     */
    @Bean
    JwtDecoder jwtDecoder(
            @Value("${jwt.secret-base64:}") String secretBase64,
            @Value("${jwt.issuer:http://localhost:8080}") String issuer
    ) {
        if (secretBase64 == null || secretBase64.isBlank()) {
            throw new IllegalStateException("jwt.secret-base64 is empty. " +
                    "Set JWT_SECRET_BASE64 env var (Base64-encoded secret).");
        }

        byte[] keyBytes = Base64.getDecoder().decode(secretBase64);
        SecretKey key = new SecretKeySpec(keyBytes, "HmacSHA256");

        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(org.springframework.security.oauth2.jose.jws.MacAlgorithm.HS256)
                .build();

        OAuth2TokenValidator<Jwt> validator =
                JwtValidators.createDefaultWithIssuer(issuer);
        decoder.setJwtValidator(validator);

        return decoder;
    }

    @Bean
    Converter<Jwt, ? extends org.springframework.security.authentication.AbstractAuthenticationToken>
    jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter scopes = new JwtGrantedAuthoritiesConverter();
        return jwt -> {
            Collection<GrantedAuthority> authorities = scopes.convert(jwt);
            String principalName = jwt.getSubject();
            return new JwtAuthenticationToken(jwt, authorities, principalName);
        };
    }

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtDecoder jwtDecoder,
            Converter<Jwt, ? extends org.springframework.security.authentication.AbstractAuthenticationToken> jwtAuthConverter,
            ObjectProvider<DevUserHeaderFilter> devFilterProvider,
            @Value("${app.security.dev-headers-enabled:false}") boolean devHeadersEnabled
    ) throws Exception {

        http.csrf(csrf -> csrf.disable());
        http.cors(cors -> cors.configurationSource(req -> {
            CorsConfiguration c = new CorsConfiguration();
            c.setAllowedOrigins(List.of("*")); // tighten for prod
            c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
            c.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-User-Id"));
            return c;
        }));
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/auth/exchange").permitAll()
                .requestMatchers("/actuator/**", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/api/**").authenticated()
                .anyRequest().permitAll()
        );

        http.oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> {
                    jwt.decoder(jwtDecoder);
                    jwt.jwtAuthenticationConverter(jwtAuthConverter);
                })
        );

        if (devHeadersEnabled) {
            DevUserHeaderFilter devFilter = devFilterProvider.getIfAvailable();
            if (devFilter != null) {
                http.addFilterBefore(devFilter, AnonymousAuthenticationFilter.class);
            }
        }

        return http.build();
    }
}
