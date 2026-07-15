package com.jsbetting.model;

import jakarta.validation.constraints.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tips")
public class Tip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Liga jest wymagana")
    private String league;

    @NotBlank(message = "Drużyna gospodarzy jest wymagana")
    private String homeTeam;

    @NotBlank(message = "Drużyna gości jest wymagana")
    private String awayTeam;

    @NotBlank(message = "Typ jest wymagany")
    private String pick;

    @NotNull(message = "Kurs jest wymagany")
    @DecimalMin(value = "1.01", message = "Kurs musi być większy niż 1.00")
    private BigDecimal odds;

    @NotNull(message = "Stawka jest wymagana")
    @Min(value = 1, message = "Stawka musi być od 1 do 10")
    @Max(value = 10, message = "Stawka musi być od 1 do 10")
    private Integer stake;

    @NotNull(message = "Data meczu jest wymagana")
    private LocalDateTime matchDate;

    @Size(max = 2000, message = "Analiza może mieć maksymalnie 2000 znaków")
    @Column(length = 2000)
    private String analysis;

    @NotNull(message = "Status jest wymagany")
    @Enumerated(EnumType.STRING)
    private TipStatus status;
    @NotNull(message = "Informacja premium jest wymagana")
    private Boolean premium = false;

    @DecimalMin(value = "0.00", message = "Cena nie może być ujemna")
    private BigDecimal price = BigDecimal.ZERO;
    public Tip() {
    }

    public Tip(String league, String homeTeam, String awayTeam, String pick, BigDecimal odds, Integer stake, LocalDateTime matchDate, String analysis, TipStatus status, Boolean premium, BigDecimal price) {
        this.league = league;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.pick = pick;
        this.odds = odds;
        this.stake = stake;
        this.matchDate = matchDate;
        this.analysis = analysis;
        this.status = status;
        this.premium = premium;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getLeague() {
        return league;
    }

    public void setLeague(String league) {
        this.league = league;
    }

    public String getHomeTeam() {
        return homeTeam;
    }

    public void setHomeTeam(String homeTeam) {
        this.homeTeam = homeTeam;
    }

    public String getAwayTeam() {
        return awayTeam;
    }

    public void setAwayTeam(String awayTeam) {
        this.awayTeam = awayTeam;
    }

    public String getPick() {
        return pick;
    }

    public void setPick(String pick) {
        this.pick = pick;
    }

    public BigDecimal getOdds() {
        return odds;
    }

    public void setOdds(BigDecimal odds) {
        this.odds = odds;
    }

    public Integer getStake() {
        return stake;
    }

    public void setStake(Integer stake) {
        this.stake = stake;
    }

    public LocalDateTime getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(LocalDateTime matchDate) {
        this.matchDate = matchDate;
    }

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }

    public TipStatus getStatus() {
        return status;
    }

    public void setStatus(TipStatus status) {
        this.status = status;
    }

    public Boolean getPremium() {
        return premium;
    }

    public void setPremium(Boolean premium) {
        this.premium = premium;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}