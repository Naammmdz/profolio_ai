package com.naammm.portfolioservice.service;

import com.naammm.portfolioservice.dto.AIPersonalityDto;
import com.naammm.portfolioservice.dto.PortfolioDto;
import com.naammm.portfolioservice.dto.PublicPersonalityDto;
import com.naammm.portfolioservice.dto.SuggestedQuestionDto;
import com.naammm.portfolioservice.dto.ProjectDto;
import com.naammm.portfolioservice.dto.SkillCategoryDto;
import com.naammm.portfolioservice.model.AIPersonality;
import com.naammm.portfolioservice.model.Portfolio;
import com.naammm.portfolioservice.model.SuggestedQuestion;
import com.naammm.portfolioservice.model.Project;
import com.naammm.portfolioservice.model.SkillCategory;
import com.naammm.portfolioservice.model.Skill;
import com.naammm.portfolioservice.model.ToolboxConfig;
import com.naammm.portfolioservice.repository.AIPersonalityRepository;
import com.naammm.portfolioservice.repository.PortfolioRepository;
import com.naammm.portfolioservice.repository.SuggestedQuestionRepository;
import com.naammm.portfolioservice.repository.ProjectRepository;
import com.naammm.portfolioservice.repository.SkillCategoryRepository;
import com.naammm.portfolioservice.repository.ToolboxConfigRepository;
import com.naammm.portfolioservice.dto.ToolboxConfigDto;
import com.naammm.portfolioservice.dto.ai.CVExtractedData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.Collections;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final AIPersonalityRepository personalityRepository;
    private final SuggestedQuestionRepository questionRepository;
    private final ProjectRepository projectRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final ToolboxConfigRepository toolboxConfigRepository;
    private final CVService cvService;
    private final AICVExtractorService aiCVExtractorService;

    // --- Portfolio CRUD ---

    @Transactional
    public PortfolioDto getPortfolioByUserId(UUID userId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultPortfolio(userId));
        return mapToPortfolioDto(portfolio);
    }

    @Transactional
    public PortfolioDto updatePortfolio(UUID userId, PortfolioDto dto) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found for user: " + userId));

        if (dto.getSlug() != null && !dto.getSlug().equals(portfolio.getSlug())) {
            if (portfolioRepository.existsBySlug(dto.getSlug())) {
                throw new IllegalArgumentException("Slug already exists: " + dto.getSlug());
            }
            portfolio.setSlug(dto.getSlug());
        }

        if (dto.getStatus() != null) portfolio.setStatus(dto.getStatus());
        if (dto.getTheme() != null) portfolio.setTheme(dto.getTheme());
        if (dto.getAvatarUrl() != null) portfolio.setAvatarUrl(dto.getAvatarUrl());
        if (dto.getAvatarShape() != null) portfolio.setAvatarShape(dto.getAvatarShape());
        if (dto.getCursorAnimation() != null) portfolio.setCursorAnimation(dto.getCursorAnimation());
        if (dto.getHeadline() != null) portfolio.setHeadline(dto.getHeadline());
        if (dto.getTagline() != null) portfolio.setTagline(dto.getTagline());
        if (dto.getChatPlaceholder() != null) portfolio.setChatPlaceholder(dto.getChatPlaceholder());
        if (dto.getShowModal() != null) portfolio.setShowModal(dto.getShowModal());
        if (dto.getModalTitle() != null) portfolio.setModalTitle(dto.getModalTitle());
        if (dto.getModalContent() != null) portfolio.setModalContent(dto.getModalContent());

        return mapToPortfolioDto(portfolioRepository.save(portfolio));
    }

    // --- Personality CRUD ---

    @Transactional
    public AIPersonalityDto getPersonality(UUID userId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultPortfolio(userId));

        AIPersonality personality = personalityRepository.findByPortfolio(portfolio)
                .orElseGet(() -> createDefaultPersonality(portfolio));

        return mapToPersonalityDto(personality);
    }

    @Transactional
    public AIPersonalityDto updatePersonality(UUID userId, AIPersonalityDto dto) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        AIPersonality personality = personalityRepository.findByPortfolio(portfolio)
                .orElseGet(() -> createDefaultPersonality(portfolio));

        if (dto.getProfessionalBio() != null) personality.setProfessionalBio(dto.getProfessionalBio());
        if (dto.getSkills() != null) personality.setSkills(dto.getSkills());
        if (dto.getBiggestFlex() != null) personality.setBiggestFlex(dto.getBiggestFlex());
        if (dto.getPersonalDrives() != null) personality.setPersonalDrives(dto.getPersonalDrives());
        if (dto.getInterests() != null) personality.setInterests(dto.getInterests());
        if (dto.getUniqueness() != null) personality.setUniqueness(dto.getUniqueness());
        if (dto.getCommunicationStyle() != null) personality.setCommunicationStyle(dto.getCommunicationStyle());
        if (dto.getTopicsLoveDiscussing() != null) personality.setTopicsLoveDiscussing(dto.getTopicsLoveDiscussing());
        if (dto.getGeneralContext() != null) personality.setGeneralContext(dto.getGeneralContext());
        if (dto.getTemperature() != null) personality.setTemperature(dto.getTemperature());

        return mapToPersonalityDto(personalityRepository.save(personality));
    }

    // --- CV Ingestion ---

    @Transactional
    public void ingestCV(UUID userId, MultipartFile file) throws IOException {
        if (!cvService.isSupportedFormat(file)) {
            throw new IllegalArgumentException("Unsupported file format. Please upload PDF or DOCX.");
        }

        String content = cvService.extractText(file);

        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultPortfolio(userId));

        AIPersonality personality = personalityRepository.findByPortfolio(portfolio)
                .orElseGet(() -> createDefaultPersonality(portfolio));

        personality.setCvText(content);
        
        // --- Call AI Extractor ---
        CVExtractedData extractedData = aiCVExtractorService.extract(content);
        
        // 1. Update Portfolio
        if (extractedData.headline() != null && !extractedData.headline().isBlank()) {
            portfolio.setHeadline(extractedData.headline());
        }
        if (extractedData.tagline() != null && !extractedData.tagline().isBlank()) {
            portfolio.setTagline(extractedData.tagline());
        }
        portfolioRepository.save(portfolio);

        // 2. Update Personality
        if (extractedData.personality() != null) {
            CVExtractedData.AIPersonalityData pData = extractedData.personality();
            if (pData.professionalBio() != null) personality.setProfessionalBio(pData.professionalBio());
            if (pData.skills() != null) personality.setSkills(pData.skills());
            if (pData.biggestFlex() != null) personality.setBiggestFlex(pData.biggestFlex());
            if (pData.personalDrives() != null) personality.setPersonalDrives(pData.personalDrives());
            if (pData.interests() != null) personality.setInterests(pData.interests());
            if (pData.uniqueness() != null) personality.setUniqueness(pData.uniqueness());
            if (pData.communicationStyle() != null) personality.setCommunicationStyle(pData.communicationStyle());
            if (pData.topicsLoveDiscussing() != null) personality.setTopicsLoveDiscussing(pData.topicsLoveDiscussing());
            if (pData.generalContext() != null) personality.setGeneralContext(pData.generalContext());
        }
        personalityRepository.save(personality);

        // 3. Update Projects
        if (extractedData.projects() != null && !extractedData.projects().isEmpty()) {
            projectRepository.deleteAll(projectRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio));
            int order = 0;
            for (CVExtractedData.ProjectData pData : extractedData.projects()) {
                Project proj = Project.builder()
                        .portfolio(portfolio)
                        .title(pData.title() != null ? pData.title() : "Unknown Project")
                        .category(pData.category() != null ? pData.category() : "Other")
                        .description(pData.description() != null ? pData.description() : "")
                        .date(pData.date() != null ? pData.date() : "")
                        .tags(pData.tags() != null ? pData.tags() : Collections.emptyList())
                        .links(Collections.emptyList())
                        .displayOrder(order++)
                        .build();
                projectRepository.save(proj);
            }
        }

        // 4. Update Skills
        if (extractedData.skillCategories() != null && !extractedData.skillCategories().isEmpty()) {
            skillCategoryRepository.deleteAll(skillCategoryRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio));
            int order = 0;
            for (CVExtractedData.SkillCategoryData catData : extractedData.skillCategories()) {
                SkillCategory cat = SkillCategory.builder()
                        .portfolio(portfolio)
                        .title(catData.title() != null ? catData.title() : "Skills")
                        .displayOrder(order++)
                        .build();
                SkillCategory savedCat = skillCategoryRepository.save(cat);
                
                if (catData.skills() != null) {
                    int skillOrder = 0;
                    List<Skill> skills = new java.util.ArrayList<>();
                    for (String skillName : catData.skills()) {
                        skills.add(Skill.builder()
                                .skillCategory(savedCat)
                                .name(skillName)
                                .displayOrder(skillOrder++)
                                .build());
                    }
                    savedCat.setSkills(skills);
                    skillCategoryRepository.save(savedCat);
                }
            }
        }
    }

    // --- Suggested Questions CRUD ---

    @Transactional(readOnly = true)
    public List<SuggestedQuestionDto> getQuestions(UUID userId) {
        return portfolioRepository.findByUserId(userId)
                .map(portfolio -> questionRepository.findByPortfolio(portfolio).stream()
                        .map(this::mapToQuestionDto)
                        .toList())
                .orElse(Collections.emptyList());
    }

    @Transactional
    public SuggestedQuestionDto addQuestion(UUID userId, SuggestedQuestionDto dto) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));

        SuggestedQuestion question = SuggestedQuestion.builder()
                .portfolio(portfolio)
                .question(dto.getQuestion())
                .category(dto.getCategory())
                .isDefault(dto.getIsDefault() != null ? dto.getIsDefault() : false)
                .build();

        return mapToQuestionDto(questionRepository.save(question));
    }

    @Transactional
    public SuggestedQuestionDto updateQuestion(UUID userId, UUID questionId, SuggestedQuestionDto dto) {
        // Simple security check: make sure question belongs to user's portfolio
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        SuggestedQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        if (!question.getPortfolio().getId().equals(portfolio.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (dto.getQuestion() != null) question.setQuestion(dto.getQuestion());
        if (dto.getCategory() != null) question.setCategory(dto.getCategory());
        if (dto.getIsDefault() != null) question.setIsDefault(dto.getIsDefault());

        return mapToQuestionDto(questionRepository.save(question));
    }

    @Transactional
    public void deleteQuestion(UUID userId, UUID questionId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        SuggestedQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        if (!question.getPortfolio().getId().equals(portfolio.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        questionRepository.delete(question);
    }

    // --- Public Portfolio ---

    @Transactional(readOnly = true)
    public Map<String, Object> getPublicPortfolio(String slug) {
        Portfolio portfolio = portfolioRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        AIPersonality personality = personalityRepository.findByPortfolio(portfolio)
                .orElseGet(() -> AIPersonality.builder().temperature(50).build());
        
        List<SuggestedQuestion> questions = questionRepository.findByPortfolio(portfolio);
        List<Project> projects = projectRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio);
        List<SkillCategory> skillCategories = skillCategoryRepository.findByPortfolioOrderByDisplayOrderAsc(portfolio);
        ToolboxConfig toolboxConfig = toolboxConfigRepository.findByPortfolio(portfolio).orElse(null);

        Map<String, Object> result = new HashMap<>();
        result.put("portfolio", mapToPortfolioDto(portfolio));
        result.put("personality", mapToPublicPersonalityDto(personality));
        result.put("questions", questions.stream().map(this::mapToQuestionDto).toList());
        result.put("projects", projects.stream().map(this::mapToProjectDto).toList());
        result.put("skills", skillCategories.stream().map(this::mapToSkillCategoryDto).toList());
        
        if (toolboxConfig != null) {
            result.put("tools", mapToToolboxConfigDto(toolboxConfig));
        } else {
            result.put("tools", null);
        }
        
        return result;
    }

    // --- Helpers & Mappers ---

    private Portfolio createDefaultPortfolio(UUID userId) {
        return portfolioRepository.save(Portfolio.builder()
                .userId(userId)
                .slug("user-" + UUID.randomUUID().toString().substring(0, 8))
                .status(Portfolio.PortfolioStatus.DRAFT)
                .theme("DEFAULT")
                .build());
    }

    private AIPersonality createDefaultPersonality(Portfolio portfolio) {
        return personalityRepository.save(AIPersonality.builder()
                .portfolio(portfolio)
                .temperature(50)
                .build());
    }

    private PortfolioDto mapToPortfolioDto(Portfolio p) {
        return PortfolioDto.builder()
                .id(p.getId())
                .slug(p.getSlug())
                .status(p.getStatus())
                .theme(p.getTheme())
                .avatarUrl(p.getAvatarUrl())
                .avatarShape(p.getAvatarShape())
                .cursorAnimation(p.getCursorAnimation())
                .headline(p.getHeadline())
                .tagline(p.getTagline())
                .chatPlaceholder(p.getChatPlaceholder())
                .showModal(p.getShowModal())
                .modalTitle(p.getModalTitle())
                .modalContent(p.getModalContent())
                .build();
    }

    private AIPersonalityDto mapToPersonalityDto(AIPersonality p) {
        return AIPersonalityDto.builder()
                .id(p.getId())
                .professionalBio(p.getProfessionalBio())
                .skills(p.getSkills())
                .biggestFlex(p.getBiggestFlex())
                .personalDrives(p.getPersonalDrives())
                .interests(p.getInterests())
                .uniqueness(p.getUniqueness())
                .communicationStyle(p.getCommunicationStyle())
                .topicsLoveDiscussing(p.getTopicsLoveDiscussing())
                .generalContext(p.getGeneralContext())
                .temperature(p.getTemperature())
                .build();
    }

    private PublicPersonalityDto mapToPublicPersonalityDto(AIPersonality p) {
        return PublicPersonalityDto.builder()
                .professionalBio(p.getProfessionalBio())
                .skills(p.getSkills())
                .biggestFlex(p.getBiggestFlex())
                .build();
    }

    private SuggestedQuestionDto mapToQuestionDto(SuggestedQuestion q) {
        return SuggestedQuestionDto.builder()
                .id(q.getId())
                .question(q.getQuestion())
                .category(q.getCategory())
                .isDefault(q.getIsDefault())
                .build();
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
                .isGlobalEnabled(c.getIsGlobalEnabled())
                .isProjectsEnabled(c.getIsProjectsEnabled())
                .isSkillsEnabled(c.getIsSkillsEnabled())
                .meInfo(ToolboxConfigDto.MeInfo.builder()
                        .isEnabled(c.getIsMeEnabled())
                        .name(c.getMeName())
                        .age(c.getMeAge())
                        .location(c.getMeLocation())
                        .introduction(c.getMeIntroduction())
                        .tags(c.getMeTags())
                        .photoUrl(c.getMePhotoUrl())
                        .build())
                .hobbiesInfo(ToolboxConfigDto.HobbiesInfo.builder()
                        .isEnabled(c.getIsHobbiesEnabled())
                        .title(c.getHobbiesTitle())
                        .description(c.getHobbiesDescription())
                        .photos(c.getHobbiesPhotos())
                        .build())
                .contactInfo(ToolboxConfigDto.ContactInfo.builder()
                        .isEnabled(c.getIsContactEnabled())
                        .name(c.getContactName())
                        .email(c.getContactEmail())
                        .phone(c.getContactPhone())
                        .handle(c.getContactHandle())
                        .address(c.getContactAddress())
                        .socialPlatforms(c.getContactSocialPlatforms())
                        .socialUrls(c.getContactSocialUrls())
                        .build())
                .resumeInfo(ToolboxConfigDto.ResumeInfo.builder()
                        .isEnabled(c.getIsResumeEnabled())
                        .title(c.getResumeTitle())
                        .description(c.getResumeDescription())
                        .fileUrl(c.getResumeFileUrl())
                        .fileName(c.getResumeFileName())
                        .build())
                .videoInfo(ToolboxConfigDto.VideoInfo.builder()
                        .isEnabled(c.getIsVideoEnabled())
                        .title(c.getVideoTitle())
                        .url(c.getVideoUrl())
                        .description(c.getVideoDescription())
                        .build())
                .locationInfo(ToolboxConfigDto.LocationInfo.builder()
                        .isEnabled(c.getIsLocationEnabled())
                        .city(c.getLocationCity())
                        .country(c.getLocationCountry())
                        .build())
                .build();
    }
}
