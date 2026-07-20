package com.jsbetting.dto;

import com.jsbetting.model.TipStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MyTipResponse {

    private Long purchaseId;
    private Long tipId;
    private String league;
    private String homeTeam;
    private String awayTeam;
    private String pick;
    private BigDecimal odds;
    private LocalDateTime matchDate;
    private TipStatus status;
    private BigDecimal pricePaid;
    private LocalDateTime purchasedAt;

    public MyTipResponse(
            Long purchaseId,
            Long tipId,
            String league,
            String homeTeam,
            String awayTeam,
            String pick,
            BigDecimal odds,
            LocalDateTime matchDate,
            TipStatus status,
            BigDecimal pricePaid,
            LocalDateTime purchasedAt
    ) {
        this.purchaseId = purchaseId;
        this.tipId = tipId;
        this.league = league;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.pick = pick;
        this.odds = odds;
        this.matchDate = matchDate;
        this.status = status;
        this.pricePaid = pricePaid;
        this.purchasedAt = purchasedAt;
    }

    public Long getPurchaseId() {
        return purchaseId;
    }

    public Long getTipId() {
        return tipId;
    }

    public String getLeague() {
        return league;
    }

    public String getHomeTeam() {
        return homeTeam;
    }

    public String getAwayTeam() {
        return awayTeam;
    }

    public String getPick() {
        return pick;
    }

    public BigDecimal getOdds() {
        return odds;
    }


    public LocalDateTime getMatchDate() {
        return matchDate;
    }

    public TipStatus getStatus() {
        return status;
    }

    public BigDecimal getPricePaid() {
        return pricePaid;
    }

    public LocalDateTime getPurchasedAt() {
        return purchasedAt;
    }
}