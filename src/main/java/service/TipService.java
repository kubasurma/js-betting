package com.jsbetting.service;

import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.jsbetting.model.Tip;
import com.jsbetting.repository.TipRepository;
import org.springframework.stereotype.Service;
import com.jsbetting.model.TipStatus;
import java.util.List;
import com.jsbetting.dto.TipOfferResponse;
import java.math.BigDecimal;
import java.math.BigDecimal;
import java.math.RoundingMode;


@Service
public class TipService {

    private final TipRepository tipRepository;

    public TipService(TipRepository tipRepository) {
        this.tipRepository = tipRepository;
    }

    public List<Tip> getAllTips() {
        return tipRepository.findAll();
    }

    public Tip getTipById(Long id) {
        return tipRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono typu"));
    }

    public List<Tip> getTipsByStatus(TipStatus status) {
        return tipRepository.findByStatus(status);
    }

    public List<Tip> getFreeTips() {
        return tipRepository.findByPremium(false);
    }

    public List<Tip> getPremiumTips() {
        return tipRepository.findByPremium(true);
    }


    public Tip createTip(Tip tip) {
        if (tip.getPremium() == null) {
            tip.setPremium(false);
        }

        if (tip.getPremium() && tip.getPrice() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Typ premium musi mieć cenę");
        }

        if (!tip.getPremium() && tip.getPrice() == null) {
            tip.setPrice(BigDecimal.ZERO);
        }

        return tipRepository.save(tip);
    }

    public void deleteTip(Long id) {
        if (!tipRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono typu");
        }

        tipRepository.deleteById(id);
    }

    public Tip updateTip(Long id, Tip updatedTip) {
        Tip existingTip = tipRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nie znaleziono typu"));

        existingTip.setLeague(updatedTip.getLeague());
        existingTip.setHomeTeam(updatedTip.getHomeTeam());
        existingTip.setAwayTeam(updatedTip.getAwayTeam());
        existingTip.setPick(updatedTip.getPick());
        existingTip.setOdds(updatedTip.getOdds());
        existingTip.setStake(updatedTip.getStake());
        existingTip.setMatchDate(updatedTip.getMatchDate());
        existingTip.setAnalysis(updatedTip.getAnalysis());
        existingTip.setStatus(updatedTip.getStatus());
        existingTip.setPremium(updatedTip.getPremium());
        existingTip.setPrice(updatedTip.getPrice());
        return tipRepository.save(existingTip);
    }


    public List<TipOfferResponse> getPremiumOffers() {
        return tipRepository.findByPremiumAndStatusOrderByMatchDateAsc(true, TipStatus.PENDING)
                .stream()
                .filter(tip -> tip.getVisible() == null || tip.getVisible())
                .map(tip -> new TipOfferResponse(
                        tip.getId(),
                        buildOddsRange(tip.getOdds()),
                        tip.getPrice()
                ))
                .toList();
    }

    private String getOddsRange(BigDecimal odds) {
        if (odds.compareTo(new BigDecimal("1.80")) < 0) {
            return "1.50 - 1.70";
        }

        if (odds.compareTo(new BigDecimal("2.20")) < 0) {
            return "1.80 - 2.19";
        }

        if (odds.compareTo(new BigDecimal("2.60")) < 0) {
            return "2.20 - 2.50";
        }

        return "2.60+";
    }

    private String buildOddsRange(BigDecimal odds) {
        if (odds == null) {
            return "Brak kursu";
        }

        BigDecimal minOdds = odds.subtract(new BigDecimal("0.10"));
        BigDecimal maxOdds = odds.add(new BigDecimal("0.10"));

        return minOdds.setScale(2, RoundingMode.HALF_UP)
                + " - "
                + maxOdds.setScale(2, RoundingMode.HALF_UP);
    }
}

