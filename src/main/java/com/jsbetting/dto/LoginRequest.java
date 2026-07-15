package com.jsbetting.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Email jest wymagany")
    @Email(message = "Niepoprawny format emaila")
    private String email;

    @NotBlank(message = "Hasło jest wymagane")
    private String password;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}