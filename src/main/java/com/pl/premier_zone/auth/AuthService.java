package com.pl.premier_zone.auth;

import com.pl.premier_zone.security.JwtService;
import com.pl.premier_zone.user.AppUser;
import com.pl.premier_zone.user.AppUserRepository;
import com.pl.premier_zone.user.Role;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String displayName = normalizeDisplayName(
                request.getDisplayName()
        );

        String email = normalizeEmail(request.getEmail());

        validatePassword(request.getPassword());

        if (appUserRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account already exists for this email."
            );
        }

        AppUser user = new AppUser(
                displayName,
                email,
                passwordEncoder.encode(request.getPassword()),
                Role.USER
        );

        AppUser savedUser = appUserRepository.save(user);

        return createAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        AppUser user = appUserRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password."
                        )
                );

        return createAuthResponse(user);
    }

    public UserResponse findCurrentUser(String email) {
        AppUser user = appUserRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User account was not found."
                        )
                );

        return toUserResponse(user);
    }

    private AuthResponse createAuthResponse(AppUser user) {
        return new AuthResponse(
                jwtService.generateToken(user),
                toUserResponse(user)
        );
    }

    private UserResponse toUserResponse(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getDisplayName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    private String normalizeDisplayName(String displayName) {
        if (displayName == null || displayName.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Display name is required."
            );
        }

        String normalized = displayName.trim();

        if (normalized.length() < 2 || normalized.length() > 80) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Display name must contain between 2 and 80 characters."
            );
        }

        return normalized;
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email is required."
            );
        }

        String normalized = email.trim().toLowerCase();

        if (!normalized.contains("@")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter a valid email address."
            );
        }

        return normalized;
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password must contain at least 8 characters."
            );
        }

        if (password.length() > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password is too long."
            );
        }
    }
}