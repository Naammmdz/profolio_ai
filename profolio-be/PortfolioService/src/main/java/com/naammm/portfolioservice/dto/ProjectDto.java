package com.naammm.portfolioservice.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ProjectDto {
    private UUID id;
    private String title;
    private String category;
    private String description;
    private String date;
    private List<String> tags;
    private List<String> links;
    private Integer displayOrder;
}
