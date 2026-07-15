package com.jsbetting.controller;

import com.jsbetting.dto.FreeTipStatusResponse;
import com.jsbetting.dto.MyTipResponse;
import com.jsbetting.model.Purchase;
import com.jsbetting.service.JwtService;
import com.jsbetting.service.PurchaseService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class PurchaseController {

    private final PurchaseService purchaseService;
    private final JwtService jwtService;

    public PurchaseController(PurchaseService purchaseService, JwtService jwtService) {
        this.purchaseService = purchaseService;
        this.jwtService = jwtService;
    }

    @PostMapping("/purchases")
    public Purchase createPurchase(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestParam Long tipId
    ) {
        Long userId = getUserIdFromToken(authorizationHeader);

        return purchaseService.createPurchase(userId, tipId);
    }

    @GetMapping("/users/me/purchases")
    public List<Purchase> getMyPurchases(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromToken(authorizationHeader);

        return purchaseService.getPurchasesByUser(userId);
    }

    @GetMapping("/users/me/purchases/active")
    public List<Purchase> getMyActivePurchases(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromToken(authorizationHeader);

        return purchaseService.getActivePurchasesByUser(userId);
    }

    @GetMapping("/users/me/purchases/history")
    public List<Purchase> getMyPurchaseHistory(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromToken(authorizationHeader);

        return purchaseService.getPurchaseHistoryByUser(userId);
    }

    @GetMapping("/users/me/my-tips/active")
    public List<MyTipResponse> getMyActiveTips(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromToken(authorizationHeader);

        return purchaseService.getActiveMyTips(userId);
    }

    @GetMapping("/users/me/my-tips/history")
    public List<MyTipResponse> getMyTipsHistory(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromToken(authorizationHeader);

        return purchaseService.getMyTipsHistory(userId);
    }

    @PostMapping("/users/me/free-tip/claim")
    public MyTipResponse claimFreeTip(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromToken(authorizationHeader);

        return purchaseService.claimFreeTip(userId);
    }

    @GetMapping("/users/me/free-tip/status")
    public FreeTipStatusResponse getFreeTipStatus(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromToken(authorizationHeader);

        return purchaseService.getFreeTipStatus(userId);
    }

    private Long getUserIdFromToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Brak tokena");
        }

        String token = authorizationHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nieprawidłowy token");
        }

        return jwtService.extractUserId(token);
    }
}