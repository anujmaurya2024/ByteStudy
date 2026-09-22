package com.bytepath.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "resource_access_logs")
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ResourceAccessLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "resource_id", nullable = false) private PyqResource resource;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(name = "accessed_at", nullable = false) private Instant accessedAt;
    @Column(name = "ip_address") private String ipAddress;
    @Column(name = "user_agent", length = 512) private String userAgent;
    @Column(length = 255) private String watermark;
}
