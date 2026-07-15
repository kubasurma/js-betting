package com.jsbetting.dto;

import com.jsbetting.model.AppUserRole;

public class AuthResponse {

    private Long userId;
    private String email;
    private String firstName;
    private AppUserRole role;
    private String message;

    public AuthResponse(Long userId, String email, String firstName, AppUserRole role, String message) {
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.role = role;
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public AppUserRole getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }
}