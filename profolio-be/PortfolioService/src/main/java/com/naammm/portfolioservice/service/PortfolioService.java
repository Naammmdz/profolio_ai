package com.naammm.portfolioservice.service;

import com.naammm.portfolioservice.dto.AIPersonalityDto;
import com.naammm.portfolioservice.dto.PortfolioDto;
import com.naammm.portfolioservice.dto.SuggestedQuestionDto;
import com.naammm.portfolioservice.model.AIPersonality;
import com.naammm.portfolioservice.model.Portfolio;
import com.naammm.portfolioservice.model.SuggestedQuestion;
import com.naammm.portfolioservice.repository.AIPersonalityRepository;
import com.naammm.portfolioservice.repository.PortfolioRepository;
import com.naammm.portfolioservice.repository.SuggestedQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final AIPersonalityRepository personalityRepository;
    private final SuggestedQuestionRepository questionRepository;
    private final CVService cvService;

    // --- Portfolio CRUD ---

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
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
        personalityRepository.save(personality);
    }

    // --- Suggested Questions CRUD ---

    @Transactional(readOnly = true)
    public List<SuggestedQuestionDto> getQuestions(UUID userId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        return questionRepository.findByPortfolio(portfolio).stream()
                .map(this::mapToQuestionDto)
                .toList();
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

        Map<String, Object> result = new HashMap<>();
        result.put("portfolio", mapToPortfolioDto(portfolio));
        result.put("personality", mapToPersonalityDto(personality));
        result.put("questions", questions.stream().map(this::mapToQuestionDto).toList());
        
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

    private SuggestedQuestionDto mapToQuestionDto(SuggestedQuestion q) {
        return SuggestedQuestionDto.builder()
                .id(q.getId())
                .question(q.getQuestion())
                .category(q.getCategory())
                .isDefault(q.getIsDefault())
                .build();
    }
}
