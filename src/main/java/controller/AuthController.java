package com.jsbetting.controller;

import com.jsbetting.dto.AuthResponse;
import com.jsbetting.dto.LoginRequest;
import com.jsbetting.dto.RegisterRequest;
import com.jsbetting.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.jsbetting.dto.AuthMeResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public AuthMeResponse getMe(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        return authService.getMe(authorizationHeader);
    }
}