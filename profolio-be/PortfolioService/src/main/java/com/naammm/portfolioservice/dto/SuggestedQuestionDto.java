package com.naammm.portfolioservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class SuggestedQuestionDto {
    private UUID id;
    private String question;
    private String category;
    private Boolean isDefault;
}
