package com.naammm.portfolioservice.dto.ai;

import java.util.List;

public record CVExtractedData(
        String headline,
        String tagline,
        AIPersonalityData personality,
        List<ProjectData> projects,
        List<SkillCategoryData> skillCategories
) {
    public record AIPersonalityData(
            String professionalBio,
            String skills,
            String biggestFlex,
            String personalDrives,
            String interests,
            String uniqueness,
            String communicationStyle,
            String topicsLoveDiscussing,
            String generalContext
    ) {}

    public record ProjectData(
            String title,
            String category,
            String description,
            String date,
            List<String> tags
    ) {}

    public record SkillCategoryData(
            String title,
            List<String> skills
    ) {}
}
