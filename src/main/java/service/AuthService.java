package com.jsbetting.service;

import com.jsbetting.dto.AuthMeResponse;
import com.jsbetting.dto.AuthResponse;
import com.jsbetting.dto.LoginRequest;
import com.jsbetting.dto.RegisterRequest;
import com.jsbetting.model.AppUser;
import com.jsbetting.model.AppUserRole;
import com.jsbetting.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthHelperService authHelperService;

    public AuthService(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthHelperService authHelperService
    ) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authHelperService = authHelperService;
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

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getRole(),
                token,
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

        String token = jwtService.generateToken(appUser);

        return new AuthResponse(
                appUser.getId(),
                appUser.getEmail(),
                appUser.getFirstName(),
                appUser.getRole(),
                token,
                "Logowanie udane"
        );
    }

    public AuthMeResponse getMe(String authorizationHeader) {
        AppUser appUser = authHelperService.getCurrentUser(authorizationHeader);

        return new AuthMeResponse(
                appUser.getId(),
                appUser.getEmail(),
                appUser.getFirstName(),
                appUser.getRole()
        );
    }
}