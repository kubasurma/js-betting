package com.jsbetting.service;

import com.jsbetting.model.AppUser;
import com.jsbetting.model.AppUserRole;
import com.jsbetting.model.Tip;
import com.jsbetting.model.TipStatus;
import com.jsbetting.repository.TipRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.jsbetting.repository.PurchaseRepository;
import java.util.List;

@Service
public class AdminService {

    private final TipRepository tipRepository;
    private final TipService tipService;
    private final AuthHelperService authHelperService;
    private final PurchaseRepository purchaseRepository;


    public AdminService(
            TipRepository tipRepository,
            TipService tipService,
            AuthHelperService authHelperService,
            PurchaseRepository purchaseRepository
    ) {
        this.tipRepository = tipRepository;
        this.tipService = tipService;
        this.authHelperService = authHelperService;
        this.purchaseRepository = purchaseRepository;
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

    public void deleteTip(Long tipId, String authorizationHeader) {
        checkAdmin(authorizationHeader);

        if (!tipRepository.existsById(tipId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Typ nie istnieje");
        }

        if (purchaseRepository.existsByTipId(tipId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nie można usunąć typu, który został już kupiony"
            );
        }

        tipRepository.deleteById(tipId);
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

    public Tip updateTipVisibility(Long tipId, Boolean visible, String authorizationHeader) {
        checkAdmin(authorizationHeader);

        Tip tip = tipRepository.findById(tipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Typ nie istnieje"));

        tip.setVisible(visible);

        return tipRepository.save(tip);
    }
}