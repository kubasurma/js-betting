package com.jsbetting.controller;

import com.jsbetting.model.Purchase;
import com.jsbetting.service.PurchaseService;
import org.springframework.web.bind.annotation.*;
import com.jsbetting.dto.MyTipResponse;
import java.util.List;
import com.jsbetting.dto.FreeTipStatusResponse;

@RestController
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @PostMapping("/purchases")
    public Purchase createPurchase(@RequestParam Long userId, @RequestParam Long tipId) {
        return purchaseService.createPurchase(userId, tipId);
    }

    @GetMapping("/users/{userId}/purchases")
    public List<Purchase> getUserPurchases(@PathVariable Long userId) {
        return purchaseService.getPurchasesByUser(userId);
    }

    @GetMapping("/users/{userId}/purchases/active")
    public List<Purchase> getActiveUserPurchases(@PathVariable Long userId) {
        return purchaseService.getActivePurchasesByUser(userId);
    }

    @GetMapping("/users/{userId}/purchases/history")
    public List<Purchase> getUserPurchaseHistory(@PathVariable Long userId) {
        return purchaseService.getPurchaseHistoryByUser(userId);
    }

    @GetMapping("/users/{userId}/my-tips/active")
    public List<MyTipResponse> getActiveMyTips(@PathVariable Long userId) {
        return purchaseService.getActiveMyTips(userId);
    }

    @GetMapping("/users/{userId}/my-tips/history")
    public List<MyTipResponse> getMyTipsHistory(@PathVariable Long userId) {
        return purchaseService.getMyTipsHistory(userId);
    }

    @PostMapping("/users/{userId}/free-tip/claim")
    public MyTipResponse claimFreeTip(@PathVariable Long userId) {
        return purchaseService.claimFreeTip(userId);
    }

    @GetMapping("/users/{userId}/free-tip/status")
    public FreeTipStatusResponse getFreeTipStatus(@PathVariable Long userId) {
        return purchaseService.getFreeTipStatus(userId);
    }

}