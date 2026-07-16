package com.jsbetting.dto;

import com.jsbetting.model.AppUserRole;

public class AuthMeResponse {

    private Long userId;
    private String email;
    private String firstName;
    private AppUserRole role;

    public AuthMeResponse(Long userId, String email, String firstName, AppUserRole role) {
        this.userId = userId;
        this.email = email;
        this.firstName = firstName;
        this.role = role;
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
}