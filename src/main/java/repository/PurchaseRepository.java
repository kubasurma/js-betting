package com.jsbetting.repository;

import com.jsbetting.model.Purchase;
import com.jsbetting.model.TipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    List<Purchase> findByAppUserIdOrderByPurchasedAtDesc(Long appUserId);

    List<Purchase> findByAppUserIdAndTip_StatusOrderByPurchasedAtDesc(Long appUserId, TipStatus status);

    List<Purchase> findByAppUserIdAndTip_StatusInOrderByPurchasedAtDesc(Long appUserId, List<TipStatus> statuses);

    Optional<Purchase> findFirstByAppUserIdAndTip_PremiumOrderByPurchasedAtDesc(Long appUserId, Boolean premium);

    boolean existsByAppUserIdAndTipId(Long appUserId, Long tipId);
}