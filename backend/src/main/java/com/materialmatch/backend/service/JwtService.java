
package com.materialmatch.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
public class JwtService {
    public io.jsonwebtoken.Claims validateToken(String token) {
    return io.jsonwebtoken.Jwts.parser()
        .verifyWith(secretKey)
        .build()
        .parseSignedClaims(token)
        .getPayload();
    }

    public boolean isValidToken(String token) {
        try {
        validateToken(token);
        return true;
        } catch (io.jsonwebtoken.JwtException
             | IllegalArgumentException ex) {
           return false;
        }
    }

    private final SecretKey secretKey;

    public JwtService(
            @Value("${materialmatch.jwt.secret:MaterialMatchAI-dev-only-secret-key-2026-change-in-production}")
            String secret) {

        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);

        if (keyBytes.length < 32) {
            throw new IllegalArgumentException(
                    "JWT secret must contain at least 32 bytes.");
        }

        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String userId, String email, String industryId) {
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(userId)
                .claim("email", email)
                .claim("industryId", industryId)
                .claim("role", "INDUSTRY_USER")
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(86400)))
                .signWith(secretKey)
                .compact();
    }
}

