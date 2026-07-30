package com.pl.premier_zone.security;

import com.pl.premier_zone.user.AppUser;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final long expirationMinutes;

    public JwtService(
            JwtEncoder jwtEncoder,
            @Value("${app.jwt.expiration-minutes}")
            long expirationMinutes
    ) {
        this.jwtEncoder = jwtEncoder;
        this.expirationMinutes = expirationMinutes;
    }

    public String generateToken(AppUser user) {
        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("premier-zone")
                .issuedAt(now)
                .expiresAt(
                        now.plus(
                                expirationMinutes,
                                ChronoUnit.MINUTES
                        )
                )
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("displayName", user.getDisplayName())
                .claim("role", user.getRole().name())
                .build();

        JwsHeader header = JwsHeader
                .with(MacAlgorithm.HS256)
                .type("JWT")
                .build();

        return jwtEncoder.encode(
                JwtEncoderParameters.from(header, claims)
        ).getTokenValue();
    }
}