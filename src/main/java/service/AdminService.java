package com.jsbetting.service;

import com.jsbetting.model.AppUser;
import com.jsbetting.model.AppUserRole;
import com.jsbetting.model.Tip;
import com.jsbetting.model.TipStatus;
import com.jsbetting.repository.AppUserRepository;
import com.jsbetting.repository.TipRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminService {

    private final AppUserRepository appUserRepository;
    private final TipRepository tipRepository;
    private final TipService tipService;
    private final JwtService jwtService;

    public AdminService(
            AppUserRepository appUserRepository,
            TipRepository tipRepository,
            TipService tipService,
            JwtService jwtService
    ) {
        this.appUserRepository = appUserRepository;
        this.tipRepository = tipRepository;
        this.tipService = tipService;
        this.jwtService = jwtService;
    }

    public Tip createTip(String authorizationHeader, Tip tip) {
        checkAdminToken(authorizationHeader);

        return tipService.createTip(tip);
    }

    public List<Tip> getAllTips(String authorizationHeader) {
        checkAdminToken(authorizationHeader);

        return tipRepository.findAll();
    }

    public Tip updateTip(String authorizationHeader, Long tipId, Tip updatedTip) {
        checkAdminToken(authorizationHeader);

        return tipService.updateTip(tipId, updatedTip);
    }

    public void deleteTip(String authorizationHeader, Long tipId) {
        checkAdminToken(authorizationHeader);

        tipService.deleteTip(tipId);
    }

    public Tip updateTipStatus(String authorizationHeader, Long tipId, TipStatus status) {
        checkAdminToken(authorizationHeader);

        Tip tip = tipRepository.findById(tipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono typu"));

        tip.setStatus(status);

        return tipRepository.save(tip);
    }

    private void checkAdminToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Brak tokena");
        }

        String token = authorizationHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nieprawidłowy token");
        }

        Long userId = jwtService.extractUserId(token);

        AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nie znaleziono użytkownika"));

        if (appUser.getRole() != AppUserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Brak uprawnień administratora");
        }
    }
}