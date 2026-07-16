package com.jsbetting.controller;

import com.jsbetting.dto.FreeTipStatusResponse;
import com.jsbetting.dto.MyTipResponse;
import com.jsbetting.dto.PurchaseResponse;
import com.jsbetting.model.AppUser;
import com.jsbetting.model.Purchase;
import com.jsbetting.service.AuthHelperService;
import com.jsbetting.service.PurchaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PurchaseController {

    private final PurchaseService purchaseService;
    private final AuthHelperService authHelperService;

    public PurchaseController(PurchaseService purchaseService, AuthHelperService authHelperService) {
        this.purchaseService = purchaseService;
        this.authHelperService = authHelperService;
    }

    @PostMapping("/purchases")
    public PurchaseResponse createPurchase(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestParam Long tipId
    ) {
        AppUser appUser = authHelperService.getCurrentUser(authorizationHeader);

        Purchase purchase = purchaseService.createPurchase(appUser.getId(), tipId);

        return new PurchaseResponse(
                purchase.getId(),
                purchase.getTip().getId(),
                purchase.getPricePaid(),
                purchase.getPurchasedAt(),
                "Zakup udany"
        );
    }

    @GetMapping("/users/me/purchases")
    public List<Purchase> getMyPurchases(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser appUser = authHelperService.getCurrentUser(authorizationHeader);

        return purchaseService.getPurchasesByUser(appUser.getId());
    }

    @GetMapping("/users/me/purchases/active")
    public List<Purchase> getMyActivePurchases(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser appUser = authHelperService.getCurrentUser(authorizationHeader);

        return purchaseService.getActivePurchasesByUser(appUser.getId());
    }

    @GetMapping("/users/me/purchases/history")
    public List<Purchase> getMyPurchaseHistory(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser appUser = authHelperService.getCurrentUser(authorizationHeader);

        return purchaseService.getPurchaseHistoryByUser(appUser.getId());
    }

    @GetMapping("/users/me/my-tips/active")
    public List<MyTipResponse> getMyActiveTips(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser appUser = authHelperService.getCurrentUser(authorizationHeader);

        return purchaseService.getActiveMyTips(appUser.getId());
    }

    @GetMapping("/users/me/my-tips/history")
    public List<MyTipResponse> getMyTipsHistory(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser appUser = authHelperService.getCurrentUser(authorizationHeader);

        return purchaseService.getMyTipsHistory(appUser.getId());
    }

    @PostMapping("/users/me/free-tip/claim")
    public MyTipResponse claimFreeTip(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser appUser = authHelperService.getCurrentUser(authorizationHeader);

        return purchaseService.claimFreeTip(appUser.getId());
    }

    @GetMapping("/users/me/free-tip/status")
    public FreeTipStatusResponse getFreeTipStatus(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        AppUser appUser = authHelperService.getCurrentUser(authorizationHeader);

        return purchaseService.getFreeTipStatus(appUser.getId());
    }
}