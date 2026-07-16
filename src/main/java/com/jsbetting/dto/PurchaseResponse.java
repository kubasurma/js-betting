package com.jsbetting.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PurchaseResponse {

    private Long purchaseId;
    private Long tipId;
    private BigDecimal pricePaid;
    private LocalDateTime purchasedAt;
    private String message;

    public PurchaseResponse(Long purchaseId, Long tipId, BigDecimal pricePaid, LocalDateTime purchasedAt, String message) {
        this.purchaseId = purchaseId;
        this.tipId = tipId;
        this.pricePaid = pricePaid;
        this.purchasedAt = purchasedAt;
        this.message = message;
    }

    public Long getPurchaseId() {
        return purchaseId;
    }

    public Long getTipId() {
        return tipId;
    }

    public BigDecimal getPricePaid() {
        return pricePaid;
    }

    public LocalDateTime getPurchasedAt() {
        return purchasedAt;
    }

    public String getMessage() {
        return message;
    }
}