package com.naammm.portfolioservice.dto;

import com.naammm.portfolioservice.model.Portfolio;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class PortfolioDto {
    private UUID id;
    private String slug;
    private Portfolio.PortfolioStatus status;
    private String theme;
    private String avatarUrl;
    private String avatarShape;
    private String cursorAnimation;
    private String headline;
    private String tagline;
    private String chatPlaceholder;
    private Boolean showModal;
    private String modalTitle;
    private String modalContent;
}
