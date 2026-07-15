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

    public AdminService(AppUserRepository appUserRepository,
                        TipRepository tipRepository,
                        TipService tipService) {
        this.appUserRepository = appUserRepository;
        this.tipRepository = tipRepository;
        this.tipService = tipService;
    }

    public Tip createTip(Long adminId, Tip tip) {
        checkAdmin(adminId);

        return tipService.createTip(tip);
    }

    public Tip updateTipStatus(Long adminId, Long tipId, TipStatus status) {
        checkAdmin(adminId);

        Tip tip = tipRepository.findById(tipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono typu"));

        tip.setStatus(status);

        return tipRepository.save(tip);
    }

    private void checkAdmin(Long adminId) {
        AppUser admin = appUserRepository.findById(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono admina"));

        if (admin.getRole() != AppUserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Brak uprawnień admina");
        }
    }

    public List<Tip> getAllTips(Long adminId) {
        checkAdmin(adminId);

        return tipRepository.findAll();
    }
}