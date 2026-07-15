package com.jsbetting.repository;

import com.jsbetting.model.Tip;
import com.jsbetting.model.TipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import java.util.List;

public interface TipRepository extends JpaRepository<Tip, Long> {

    List<Tip> findByStatus(TipStatus status);

    List<Tip> findByPremium(Boolean premium);

    List<Tip> findByPremiumAndStatusOrderByMatchDateAsc(Boolean premium, TipStatus status);

    List<Tip> findByPremiumAndStatusAndOddsBetweenOrderByMatchDateAsc(
            Boolean premium,
            TipStatus status,
            BigDecimal minOdds,
            BigDecimal maxOdds
    );


}
