package com.naammm.portfolioservice.dto;

import lombok.Builder;
import lombok.Data;

/**
 * A sanitized version of AIPersonalityDto for public-facing endpoints.
 * Excludes sensitive data like cvText, generalContext, and internal
 * personality configuration that should only be visible to the portfolio owner.
 */
@Data
@Builder
public class PublicPersonalityDto {
    private String professionalBio;
    private String skills;
    private String biggestFlex;
}
