
package com.materialmatch.backend.security;

import com.materialmatch.backend.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                Claims claims = jwtService.validateToken(token);
                String userId = claims.getSubject();
                String role = claims.get("role", String.class);

                if (userId == null || role == null) {
                    response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Invalid authentication token"
                    );
                    return;
                }

                var authentication =
                    new UsernamePasswordAuthenticationToken(
                        userId,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                    );

                SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            } catch (io.jsonwebtoken.JwtException
                     | IllegalArgumentException ex) {
                SecurityContextHolder.clearContext();
                response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired token"
                );
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}

