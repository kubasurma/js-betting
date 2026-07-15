package com.jsbetting.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Email jest wymagany")
    @Email(message = "Niepoprawny format emaila")
    private String email;

    @NotBlank(message = "Imię jest wymagane")
    private String firstName;

    @NotBlank(message = "Hasło jest wymagane")
    @Size(min = 6, message = "Hasło musi mieć minimum 6 znaków")
    private String password;

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getPassword() {
        return password;
    }
}