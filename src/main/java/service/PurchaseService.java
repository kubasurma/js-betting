package com.jsbetting.service;

import com.jsbetting.model.AppUser;
import com.jsbetting.model.Purchase;
import com.jsbetting.model.Tip;
import com.jsbetting.repository.AppUserRepository;
import com.jsbetting.repository.PurchaseRepository;
import com.jsbetting.repository.TipRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.jsbetting.model.TipStatus;
import java.util.Arrays;
import java.math.BigDecimal;
import java.util.List;
import com.jsbetting.dto.MyTipResponse;
import java.time.LocalDateTime;
import java.util.Optional;
import com.jsbetting.dto.FreeTipStatusResponse;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final AppUserRepository appUserRepository;
    private final TipRepository tipRepository;
    private final MailService mailService;

    public PurchaseService(PurchaseRepository purchaseRepository,
                           AppUserRepository appUserRepository,
                           TipRepository tipRepository,
                           MailService mailService) {
        this.purchaseRepository = purchaseRepository;
        this.appUserRepository = appUserRepository;
        this.tipRepository = tipRepository;
        this.mailService = mailService;
    }

    public Purchase createPurchase(Long userId, Long tipId) {
        AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono użytkownika"));

        Tip tip = tipRepository.findById(tipId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono typu"));

        if (tip.getPremium() == null || !tip.getPremium()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Darmowy typ można odebrać tylko przez free-tip/claim"
            );
        }


        if (purchaseRepository.existsByAppUserIdAndTipId(userId, tipId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Użytkownik już kupił ten typ");
        }

        BigDecimal pricePaid = tip.getPrice();

        if (pricePaid == null) {
            pricePaid = BigDecimal.ZERO;
        }

        Purchase purchase = new Purchase(appUser, tip, pricePaid);

        Purchase savedPurchase = purchaseRepository.save(purchase);

        mailService.sendPurchaseConfirmation(savedPurchase);

        return savedPurchase;
    }

    public List<Purchase> getPurchasesByUser(Long userId) {
        if (!appUserRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono użytkownika");
        }

        return purchaseRepository.findByAppUserIdOrderByPurchasedAtDesc(userId);
    }
    public List<Purchase> getActivePurchasesByUser(Long userId) {
        if (!appUserRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono użytkownika");
        }

        return purchaseRepository.findByAppUserIdAndTip_StatusOrderByPurchasedAtDesc(userId, TipStatus.PENDING);
    }

    public List<Purchase> getPurchaseHistoryByUser(Long userId) {
        if (!appUserRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono użytkownika");
        }

        return purchaseRepository.findByAppUserIdAndTip_StatusInOrderByPurchasedAtDesc(
                userId,
                Arrays.asList(TipStatus.WON, TipStatus.LOST)
        );
    }

    public List<MyTipResponse> getActiveMyTips(Long userId) {
        return getActivePurchasesByUser(userId)
                .stream()
                .map(this::mapToMyTipResponse)
                .toList();
    }

    public List<MyTipResponse> getMyTipsHistory(Long userId) {
        return getPurchaseHistoryByUser(userId)
                .stream()
                .map(this::mapToMyTipResponse)
                .toList();
    }

    private MyTipResponse mapToMyTipResponse(Purchase purchase) {
        return new MyTipResponse(
                purchase.getId(),
                purchase.getTip().getId(),
                purchase.getTip().getLeague(),
                purchase.getTip().getHomeTeam(),
                purchase.getTip().getAwayTeam(),
                purchase.getTip().getPick(),
                purchase.getTip().getOdds(),
                purchase.getTip().getStake(),
                purchase.getTip().getMatchDate(),
                purchase.getTip().getAnalysis(),
                purchase.getTip().getStatus(),
                purchase.getPricePaid(),
                purchase.getPurchasedAt()
        );
    }

    public MyTipResponse claimFreeTip(Long userId) {
        AppUser appUser = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono użytkownika"));

        Optional<Purchase> lastFreePurchase = purchaseRepository
                .findFirstByAppUserIdAndTip_PremiumOrderByPurchasedAtDesc(userId, false);

        if (lastFreePurchase.isPresent()) {
            LocalDateTime lastFreeDate = lastFreePurchase.get().getPurchasedAt();
            LocalDateTime nextAllowedDate = lastFreeDate.plusDays(5);

            if (LocalDateTime.now().isBefore(nextAllowedDate)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Darmowy typ można odebrać raz na 5 dni"
                );
            }
        }

        List<Tip> freeTips = tipRepository.findByPremiumAndStatusAndOddsBetweenOrderByMatchDateAsc(
                false,
                TipStatus.PENDING,
                new BigDecimal("1.50"),
                new BigDecimal("1.70")
        );

        Tip selectedTip = freeTips.stream()
                .filter(tip -> !purchaseRepository.existsByAppUserIdAndTipId(userId, tip.getId()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Brak dostępnego darmowego typu"));

        Purchase purchase = new Purchase(appUser, selectedTip, BigDecimal.ZERO);

        Purchase savedPurchase = purchaseRepository.save(purchase);

        mailService.sendPurchaseConfirmation(savedPurchase);

        return mapToMyTipResponse(savedPurchase);
    }


    public FreeTipStatusResponse getFreeTipStatus(Long userId) {
        if (!appUserRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono użytkownika");
        }

        Optional<Purchase> lastFreePurchase = purchaseRepository
                .findFirstByAppUserIdAndTip_PremiumOrderByPurchasedAtDesc(userId, false);

        if (lastFreePurchase.isEmpty()) {
            return new FreeTipStatusResponse(
                    true,
                    null,
                    "Możesz odebrać darmowy typ"
            );
        }

        LocalDateTime lastFreeDate = lastFreePurchase.get().getPurchasedAt();
        LocalDateTime nextAllowedDate = lastFreeDate.plusDays(5);

        if (LocalDateTime.now().isBefore(nextAllowedDate)) {
            return new FreeTipStatusResponse(
                    false,
                    nextAllowedDate,
                    "Darmowy typ można odebrać raz na 5 dni"
            );
        }

        return new FreeTipStatusResponse(
                true,
                null,
                "Możesz odebrać darmowy typ"
        );
    }

}