package com.jsbetting.service;

import com.jsbetting.model.AppUser;
import com.jsbetting.model.AppUserRole;
import com.jsbetting.model.Tip;
import com.jsbetting.model.TipStatus;
import com.jsbetting.repository.TipRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminService {

    private final TipRepository tipRepository;
    private final TipService tipService;
    private final AuthHelperService authHelperService;

    public AdminService(
            TipRepository tipRepository,
            TipService tipService,
            AuthHelperService authHelperService
    ) {
        this.tipRepository = tipRepository;
        this.tipService = tipService;
        this.authHelperService = authHelperService;
    }

    public Tip createTip(String authorizationHeader, Tip tip) {
        checkAdmin(authorizationHeader);

        return tipService.createTip(tip);
    }

    public List<Tip> getAllTips(String authorizationHeader) {
        checkAdmin(authorizationHeader);

        return tipRepository.findAll();
    }

    public Tip updateTip(String authorizationHeader, Long tipId, Tip updatedTip) {
        checkAdmin(authorizationHeader);

        return tipService.updateTip(tipId, updatedTip);
    }

    public void deleteTip(String authorizationHeader, Long tipId) {
        checkAdmin(authorizationHeader);

        tipService.deleteTip(tipId);
    }

    public Tip updateTipStatus(String authorizationHeader, Long tipId, TipStatus status) {
        checkAdmin(authorizationHeader);

        Tip tip = tipRepository.findById(tipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono typu"));

        tip.setStatus(status);

        return tipRepository.save(tip);
    }

    private void checkAdmin(String authorizationHeader) {
        AppUser appUser = authHelperService.getCurrentUser(authorizationHeader);

        if (appUser.getRole() != AppUserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Brak uprawnień administratora");
        }
    }
}