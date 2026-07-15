package com.jsbetting.service;

import com.jsbetting.model.AppUser;
import com.jsbetting.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;

    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public AppUser createUser(AppUser appUser) {
        if (appUserRepository.existsByEmail(appUser.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Użytkownik z takim emailem już istnieje");
        }

        return appUserRepository.save(appUser);
    }

    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    public AppUser getUserById(Long id) {
        return appUserRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono użytkownika"));
    }


}