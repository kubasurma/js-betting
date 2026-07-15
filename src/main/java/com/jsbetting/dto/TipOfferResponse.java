package com.jsbetting.dto;

import java.math.BigDecimal;

public class TipOfferResponse {

    private Long id;
    private String oddsRange;
    private BigDecimal price;

    public TipOfferResponse(Long id, String oddsRange, BigDecimal price) {
        this.id = id;
        this.oddsRange = oddsRange;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getOddsRange() {
        return oddsRange;
    }

    public BigDecimal getPrice() {
        return price;
    }
}