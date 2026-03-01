package com.naammm.portfolioservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "portfolios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(unique = true, nullable = false)
    private String slug;

    @Enumerated(EnumType.STRING)
    private PortfolioStatus status = PortfolioStatus.DRAFT;

    private String theme = "DEFAULT";

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "avatar_shape")
    private String avatarShape = "SQUARED";

    @Column(name = "cursor_animation")
    private String cursorAnimation = "FLUID";

    private String headline;
    private String tagline;

    @Column(name = "chat_placeholder")
    private String chatPlaceholder = "Ask me anything...";

    @Column(name = "show_modal")
    private Boolean showModal = true;

    @Column(name = "modal_title")
    private String modalTitle;

    @Column(name = "modal_content", columnDefinition = "TEXT")
    private String modalContent;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PortfolioStatus {
        DRAFT, PUBLISHED
    }
}
