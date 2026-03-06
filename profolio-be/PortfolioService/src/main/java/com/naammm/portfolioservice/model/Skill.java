package com.naammm.portfolioservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_category_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private SkillCategory skillCategory;

    @Column(nullable = false)
    private String name;

    @Column(name = "display_order")
    private Integer displayOrder;
}
