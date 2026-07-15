package com.jsbetting.controller;

import com.jsbetting.model.AppUser;
import com.jsbetting.service.AppUserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AppUserController {

    private final AppUserService appUserService;

    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @PostMapping("/users")
    public AppUser createUser(@Valid @RequestBody AppUser appUser) {
        return appUserService.createUser(appUser);
    }

    @GetMapping("/users")
    public List<AppUser> getUsers() {
        return appUserService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public AppUser getUserById(@PathVariable Long id) {
        return appUserService.getUserById(id);
    }

}