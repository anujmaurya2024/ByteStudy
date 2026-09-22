package com.bytepath.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "subscriptions", indexes = {
    @Index(name = "idx_subscription_user_status", columnList = "user_id,status")
})
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Subscription {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String plan;

    @Column(nullable = false)
    private String status;

    private String provider;
    private String providerPaymentId;
    private Instant startsAt;
    private Instant expiresAt;

    @Builder.Default
    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public boolean isActive(Instant now) {
        return "ACTIVE".equals(status)
            && (startsAt == null || !startsAt.isAfter(now))
            && (expiresAt == null || expiresAt.isAfter(now));
    }
}
