package com.jsbetting.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;



@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @ManyToOne
    @JoinColumn(name = "tip_id", nullable = false)
    private Tip tip;

    @Column(nullable = false)
    private LocalDateTime purchasedAt = LocalDateTime.now();

    @Column(nullable = false)
    private BigDecimal pricePaid;

    public Purchase() {
    }

    public Purchase(AppUser appUser, Tip tip, BigDecimal pricePaid) {
        this.appUser = appUser;
        this.tip = tip;
        this.pricePaid = pricePaid;
    }

    public Long getId() {
        return id;
    }

    public AppUser getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }

    public Tip getTip() {
        return tip;
    }

    public void setTip(Tip tip) {
        this.tip = tip;
    }

    public LocalDateTime getPurchasedAt() {
        return purchasedAt;
    }

    public BigDecimal getPricePaid() {
        return pricePaid;
    }

    public void setPricePaid(BigDecimal pricePaid) {
        this.pricePaid = pricePaid;
    }
}