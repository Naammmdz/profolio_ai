package com.naammm.portfolioservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AIPersonalityDto {
    private UUID id;
    private String professionalBio;
    private String skills;
    private String biggestFlex;
    private String personalDrives;
    private String interests;
    private String uniqueness;
    private String communicationStyle;
    private String topicsLoveDiscussing;
    private String generalContext;
    private Integer temperature;
}
