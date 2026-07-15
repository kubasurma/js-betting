package com.jsbetting.dto;

import java.time.LocalDateTime;

public class FreeTipStatusResponse {

    private boolean canClaim;
    private LocalDateTime nextAvailableAt;
    private String message;

    public FreeTipStatusResponse(boolean canClaim, LocalDateTime nextAvailableAt, String message) {
        this.canClaim = canClaim;
        this.nextAvailableAt = nextAvailableAt;
        this.message = message;
    }

    public boolean isCanClaim() {
        return canClaim;
    }

    public LocalDateTime getNextAvailableAt() {
        return nextAvailableAt;
    }

    public String getMessage() {
        return message;
    }
}