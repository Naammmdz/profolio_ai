package com.naammm.portfolioservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class SkillCategoryDto {
    private UUID id;
    private String title;
    private List<String> skills;
    private Integer displayOrder;
}
