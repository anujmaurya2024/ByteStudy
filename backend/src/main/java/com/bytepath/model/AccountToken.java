package com.bytepath.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
@Entity @Table(name="account_tokens", indexes=@Index(name="idx_account_token_hash", columnList="token_hash", unique=true))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AccountToken {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="user_id", nullable=false) private User user;
 @Column(name="token_hash", nullable=false, unique=true, length=128) private String tokenHash;
 @Column(nullable=false) private String purpose;
 @Column(name="expires_at", nullable=false) private Instant expiresAt;
 @Column(nullable=false) private boolean used;
}
