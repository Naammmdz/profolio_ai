package com.naammm.portfolioservice.service;

import com.naammm.portfolioservice.dto.ProjectDto;
import com.naammm.portfolioservice.dto.SkillCategoryDto;
import com.naammm.portfolioservice.dto.ToolboxConfigDto;
import com.naammm.portfolioservice.model.*;
import com.naammm.portfolioservice.repository.PortfolioRepository;
import com.naammm.portfolioservice.repository.ProjectRepository;
import com.naammm.portfolioservice.repository.SkillCategoryRepository;
import com.naammm.portfolioservice.repository.ToolboxConfigRepository;
import com.naammm.portfolioservice.repository.ProjectRepository;
import com.naammm.portfolioservice.repository.SkillCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ToolsService {

    private final PortfolioRepository portfolioRepository;
    private final ProjectRepository projectRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final ToolboxConfigRepository toolboxConfigRepository;

    // ─── Toolbox Config ──────────────────────────────────────

    @Transactional(readOnly = true)
    public ToolboxConfigDto getToolboxConfig(String userId) {
        Portfolio portfolio = getPortfolioByUserId(userId);
        ToolboxConfig config = toolboxConfigRepository.findByPortfolio(portfolio)
                .orElseGet(() -> createEmptyToolboxConfig(portfolio));
        return mapToToolboxConfigDto(config);
    }

    @Transactional
    public ToolboxConfigDto updateToolboxConfig(String userId, ToolboxConfigDto dto) {
        Portfolio portfolio = getPortfolioByUserId(userId);
        ToolboxConfig config = toolboxConfigRepository.findByPortfolio(portfolio)
                .orElseGet(() -> createEmptyToolboxConfig(portfolio));

        if (dto.getMeInfo() != null) {
            config.setMeName(dto.getMeInfo().getName());
            config.setMeAge(dto.getMeInfo().getAge());
            config.setMeLocation(dto.getMeInfo().getLocation());
            config.setMeIntroduction(dto.getMeInfo().getIntroduction());
            config.setMeTags(dto.getMeInfo().getTags());
            config.setMePhotoUrl(dto.getMeInfo().getPhotoUrl());
        }

        if (dto.getHobbiesInfo() != null) {
            config.setHobbiesTitle(dto.getHobbiesInfo().getTitle());
            config.setHobbiesDescription(dto.getHobbiesInfo().getDescription());
            config.setHobbiesPhotos(dto.getHobbiesInfo().getPhotos());
        }

        if (dto.getContactInfo() != null) {
            config.setContactName(dto.getContactInfo().getName());
            config.setContactEmail(dto.getContactInfo().getEmail());
            config.setContactPhone(dto.getContactInfo().getPhone());
            config.setContactHandle(dto.getContactInfo().getHandle());
            config.setContactAddress(dto.getContactInfo().getAddress());
            config.setContactSocialPlatforms(dto.getContactInfo().getSocialPlatforms());
            config.setContactSocialUrls(dto.getContactInfo().getSocialUrls());
        }

        if (dto.getResumeInfo() != null) {
            config.setResumeTitle(dto.getResumeInfo().getTitle());
            config.setResumeDescription(dto.getResumeInfo().getDescription());
            config.setResumeFileUrl(dto.getResumeInfo().getFileUrl());
            config.setResumeFileName(dto.getResumeInfo().getFileName());
        }

        if (dto.getVideoInfo() != null) {
            config.setVideoTitle(dto.getVideoInfo().getTitle());
            config.setVideoUrl(dto.getVideoInfo().getUrl());
            config.setVideoDescription(dto.getVideoInfo().getDescription());
        }

        if (dto.getLocationInfo() != null) {
            config.setLocationCity(dto.getLocationInfo().getCity());
            config.setLocationCountry(dto.getLocationInfo().getCountry());
        }

        return mapToToolboxConfigDto(toolboxConfigRepository.save(config));
    }

    private ToolboxConfig createEmptyToolboxConfig(Portfolio portfolio) {
        return toolboxConfigRepository.save(ToolboxConfig.builder()
                .portfolio(portfolio)
                .build());
    }

    // ─── Projects ────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ProjectDto> getProjects(String userId) {
        Portfolio portfolio = getPortfolioByUserId(userId);
        return projectRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio)
                .stream().map(this::mapToProjectDto).toList();
    }

    @Transactional
    public ProjectDto createProject(String userId, ProjectDto dto) {
        Portfolio portfolio = getPortfolioByUserId(userId);
        
        List<Project> existing = projectRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio);
        
        Project project = Project.builder()
                .portfolio(portfolio)
                .title(dto.getTitle())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .date(dto.getDate())
                .tags(dto.getTags() != null ? dto.getTags() : new ArrayList<>())
                .links(dto.getLinks() != null ? dto.getLinks() : new ArrayList<>())
                .displayOrder(existing.size())
                .build();
        
        return mapToProjectDto(projectRepository.save(project));
    }

    @Transactional
    public ProjectDto updateProject(String userId, UUID projectId, ProjectDto dto) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        verifyOwnership(project.getPortfolio(), userId);
        
        if (dto.getTitle() != null) project.setTitle(dto.getTitle());
        if (dto.getCategory() != null) project.setCategory(dto.getCategory());
        if (dto.getDescription() != null) project.setDescription(dto.getDescription());
        if (dto.getDate() != null) project.setDate(dto.getDate());
        if (dto.getTags() != null) project.setTags(dto.getTags());
        if (dto.getLinks() != null) project.setLinks(dto.getLinks());
        if (dto.getDisplayOrder() != null) project.setDisplayOrder(dto.getDisplayOrder());
        
        return mapToProjectDto(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(String userId, UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        
        verifyOwnership(project.getPortfolio(), userId);
        projectRepository.delete(project);
    }

    // ─── Skill Categories ────────────────────────────────────

    @Transactional(readOnly = true)
    public List<SkillCategoryDto> getSkillCategories(String userId) {
        Portfolio portfolio = getPortfolioByUserId(userId);
        return skillCategoryRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio)
                .stream().map(this::mapToSkillCategoryDto).toList();
    }

    @Transactional
    public SkillCategoryDto createSkillCategory(String userId, SkillCategoryDto dto) {
        Portfolio portfolio = getPortfolioByUserId(userId);
        
        List<SkillCategory> existing = skillCategoryRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio);
        
        SkillCategory category = SkillCategory.builder()
                .portfolio(portfolio)
                .title(dto.getTitle())
                .displayOrder(existing.size())
                .skills(new ArrayList<>())
                .build();
        
        if (dto.getSkills() != null) {
            List<Skill> skills = IntStream.range(0, dto.getSkills().size())
                    .mapToObj(i -> Skill.builder()
                            .skillCategory(category)
                            .name(dto.getSkills().get(i))
                            .displayOrder(i)
                            .build())
                    .toList();
            category.getSkills().addAll(skills);
        }
        
        return mapToSkillCategoryDto(skillCategoryRepository.save(category));
    }

    @Transactional
    public SkillCategoryDto updateSkillCategory(String userId, UUID categoryId, SkillCategoryDto dto) {
        SkillCategory category = skillCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Skill category not found"));
        
        verifyOwnership(category.getPortfolio(), userId);
        
        if (dto.getTitle() != null) category.setTitle(dto.getTitle());
        if (dto.getDisplayOrder() != null) category.setDisplayOrder(dto.getDisplayOrder());
        
        if (dto.getSkills() != null) {
            category.getSkills().clear();
            List<Skill> newSkills = IntStream.range(0, dto.getSkills().size())
                    .mapToObj(i -> Skill.builder()
                            .skillCategory(category)
                            .name(dto.getSkills().get(i))
                            .displayOrder(i)
                            .build())
                    .toList();
            category.getSkills().addAll(newSkills);
        }
        
        return mapToSkillCategoryDto(skillCategoryRepository.save(category));
    }

    @Transactional
    public void deleteSkillCategory(String userId, UUID categoryId) {
        SkillCategory category = skillCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Skill category not found"));
        
        verifyOwnership(category.getPortfolio(), userId);
        skillCategoryRepository.delete(category);
    }

    // ─── Helpers ─────────────────────────────────────────────

    private Portfolio getPortfolioByUserId(String userId) {
        return portfolioRepository.findByUserId(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
    }

    private void verifyOwnership(Portfolio portfolio, String userId) {
        if (!portfolio.getUserId().toString().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
    }

    private ProjectDto mapToProjectDto(Project p) {
        return ProjectDto.builder()
                .id(p.getId())
                .title(p.getTitle())
                .category(p.getCategory())
                .description(p.getDescription())
                .date(p.getDate())
                .tags(p.getTags())
                .links(p.getLinks())
                .displayOrder(p.getDisplayOrder())
                .build();
    }

    private SkillCategoryDto mapToSkillCategoryDto(SkillCategory c) {
        List<String> skillNames = c.getSkills() != null
                ? c.getSkills().stream().map(Skill::getName).toList()
                : new ArrayList<>();
        
        return SkillCategoryDto.builder()
                .id(c.getId())
                .title(c.getTitle())
                .skills(skillNames)
                .displayOrder(c.getDisplayOrder())
                .build();
    }

    private ToolboxConfigDto mapToToolboxConfigDto(ToolboxConfig c) {
        return ToolboxConfigDto.builder()
                .meInfo(ToolboxConfigDto.MeInfo.builder()
                        .name(c.getMeName())
                        .age(c.getMeAge())
                        .location(c.getMeLocation())
                        .introduction(c.getMeIntroduction())
                        .tags(c.getMeTags())
                        .photoUrl(c.getMePhotoUrl())
                        .build())
                .hobbiesInfo(ToolboxConfigDto.HobbiesInfo.builder()
                        .title(c.getHobbiesTitle())
                        .description(c.getHobbiesDescription())
                        .photos(c.getHobbiesPhotos())
                        .build())
                .contactInfo(ToolboxConfigDto.ContactInfo.builder()
                        .name(c.getContactName())
                        .email(c.getContactEmail())
                        .phone(c.getContactPhone())
                        .handle(c.getContactHandle())
                        .address(c.getContactAddress())
                        .socialPlatforms(c.getContactSocialPlatforms())
                        .socialUrls(c.getContactSocialUrls())
                        .build())
                .resumeInfo(ToolboxConfigDto.ResumeInfo.builder()
                        .title(c.getResumeTitle())
                        .description(c.getResumeDescription())
                        .fileUrl(c.getResumeFileUrl())
                        .fileName(c.getResumeFileName())
                        .build())
                .videoInfo(ToolboxConfigDto.VideoInfo.builder()
                        .title(c.getVideoTitle())
                        .url(c.getVideoUrl())
                        .description(c.getVideoDescription())
                        .build())
                .locationInfo(ToolboxConfigDto.LocationInfo.builder()
                        .city(c.getLocationCity())
                        .country(c.getLocationCountry())
                        .build())
                .build();
    }
}
