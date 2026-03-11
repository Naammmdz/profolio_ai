package com.naammm.portfolioservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "toolbox_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode
public class ToolboxConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false, unique = true)
    private Portfolio portfolio;

    @Column(name = "is_global_enabled")
    private Boolean isGlobalEnabled;

    @Column(name = "is_projects_enabled")
    private Boolean isProjectsEnabled;

    @Column(name = "is_skills_enabled")
    private Boolean isSkillsEnabled;

    // Me Info
    @Column(name = "is_me_enabled")
    private Boolean isMeEnabled;
    private String meName;
    private String meAge;
    private String meLocation;
    @Column(columnDefinition = "TEXT")
    private String meIntroduction;
    
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "TEXT[]")
    private List<String> meTags;
    
    private String mePhotoUrl;

    // Fun & Hobbies
    @Column(name = "is_hobbies_enabled")
    private Boolean isHobbiesEnabled;
    private String hobbiesTitle;
    @Column(columnDefinition = "TEXT")
    private String hobbiesDescription;
    
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "TEXT[]")
    private List<String> hobbiesPhotos;

    // Contact
    @Column(name = "is_contact_enabled")
    private Boolean isContactEnabled;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String contactHandle;
    private String contactAddress;
    
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "TEXT[]")
    private List<String> contactSocialPlatforms;
    
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "TEXT[]")
    private List<String> contactSocialUrls;

    // Resume
    @Column(name = "is_resume_enabled")
    private Boolean isResumeEnabled;
    private String resumeTitle;
    @Column(columnDefinition = "TEXT")
    private String resumeDescription;
    private String resumeFileUrl;
    private String resumeFileName;

    // Video
    @Column(name = "is_video_enabled")
    private Boolean isVideoEnabled;
    private String videoTitle;
    private String videoUrl;
    @Column(columnDefinition = "TEXT")
    private String videoDescription;

    // Location
    @Column(name = "is_location_enabled")
    private Boolean isLocationEnabled;
    private String locationCity;
    private String locationCountry;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
