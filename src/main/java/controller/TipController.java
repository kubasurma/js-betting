package com.jsbetting.controller;

import com.jsbetting.dto.TipOfferResponse;
import com.jsbetting.service.TipService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TipController {

    private final TipService tipService;

    public TipController(TipService tipService) {
        this.tipService = tipService;
    }

    @GetMapping("/offers/premium")
    public List<TipOfferResponse> getPremiumOffers() {
        return tipService.getPremiumOffers();
    }
}