package com.jsbetting.service;

import com.jsbetting.dto.AuthResponse;
import com.jsbetting.dto.LoginRequest;
import com.jsbetting.dto.RegisterRequest;
import com.jsbetting.model.AppUser;
import com.jsbetting.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.jsbetting.model.AppUserRole;


@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AppUserRepository appUserRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Użytkownik z takim emailem już istnieje");
        }

        AppUser appUser = new AppUser(request.getEmail(), request.getFirstName());

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        appUser.setPassword(hashedPassword);
        appUser.setRole(AppUserRole.USER);

        AppUser savedUser = appUserRepository.save(appUser);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getRole(),
                "Rejestracja udana"
        );
    }

    public AuthResponse login(LoginRequest request) {
        AppUser appUser = appUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Nieprawidłowy email lub hasło"
                ));

        if (appUser.getPassword() == null || !passwordEncoder.matches(request.getPassword(), appUser.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nieprawidłowy email lub hasło"
            );
        }

        return new AuthResponse(
                appUser.getId(),
                appUser.getEmail(),
                appUser.getFirstName(),
                appUser.getRole(),
                "Logowanie udane"
        );
    }
}