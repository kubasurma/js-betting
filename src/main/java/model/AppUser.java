package com.jsbetting.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "app_users")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email jest wymagany")
    @Email(message = "Niepoprawny format emaila")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Imię jest wymagane")
    @Column(nullable = false)
    private String firstName;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column
    private String password;

    @Enumerated(EnumType.STRING)
    private AppUserRole role = AppUserRole.USER;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public AppUser() {
    }

    public AppUser(String email, String firstName) {
        this.email = email;
        this.firstName = firstName;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public AppUserRole getRole() {
        return role;
    }

    public void setRole(AppUserRole role) {
        this.role = role;
    }

}
