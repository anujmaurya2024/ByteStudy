package com.bytepath.repository;

import com.bytepath.model.Subscription;
import com.bytepath.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserOrderByCreatedAtDesc(User user);
    Optional<Subscription> findByProviderPaymentId(String providerPaymentId);
}
