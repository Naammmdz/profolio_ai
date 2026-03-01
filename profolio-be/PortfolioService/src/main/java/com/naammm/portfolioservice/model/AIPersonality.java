package com.naammm.portfolioservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_personalities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIPersonality {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @Column(name = "cv_text", columnDefinition = "TEXT")
    private String cvText;

    @Column(name = "professional_bio", columnDefinition = "TEXT")
    private String professionalBio;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "biggest_flex", columnDefinition = "TEXT")
    private String biggestFlex;

    @Column(name = "personal_drives", columnDefinition = "TEXT")
    private String personalDrives;

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(columnDefinition = "TEXT")
    private String uniqueness;

    @Column(name = "communication_style", columnDefinition = "TEXT")
    private String communicationStyle;

    @Column(name = "topics_love_discussing", columnDefinition = "TEXT")
    private String topicsLoveDiscussing;

    @Column(name = "general_context", columnDefinition = "TEXT")
    private String generalContext;

    private Integer temperature = 50;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
