package com.naammm.portfolioservice.controller;

import com.naammm.portfolioservice.dto.AIPersonalityDto;
import com.naammm.portfolioservice.dto.PortfolioDto;
import com.naammm.portfolioservice.dto.SuggestedQuestionDto;
import com.naammm.portfolioservice.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    // --- Portfolio Endpoints ---

    @GetMapping("/portfolio")
    public ResponseEntity<PortfolioDto> getPortfolio(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(portfolioService.getPortfolioByUserId(userId));
    }

    @PutMapping("/portfolio")
    public ResponseEntity<PortfolioDto> updatePortfolio(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody PortfolioDto dto
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(portfolioService.updatePortfolio(userId, dto));
    }

    // --- Personality Endpoints ---

    @GetMapping("/personality")
    public ResponseEntity<AIPersonalityDto> getPersonality(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(portfolioService.getPersonality(userId));
    }

    @PutMapping("/personality")
    public ResponseEntity<AIPersonalityDto> updatePersonality(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody AIPersonalityDto dto
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(portfolioService.updatePersonality(userId, dto));
    }

    // --- Questions Endpoints ---

    @GetMapping("/questions")
    public ResponseEntity<List<SuggestedQuestionDto>> getQuestions(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(portfolioService.getQuestions(userId));
    }

    @PostMapping("/questions")
    public ResponseEntity<SuggestedQuestionDto> addQuestion(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody SuggestedQuestionDto dto
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(portfolioService.addQuestion(userId, dto));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<SuggestedQuestionDto> updateQuestion(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @RequestBody SuggestedQuestionDto dto
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(portfolioService.updateQuestion(userId, id, dto));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        portfolioService.deleteQuestion(userId, id);
        return ResponseEntity.ok().build();
    }

    // --- Public Endpoints (No Auth) ---

    @GetMapping("/public/portfolio/{slug}")
    public ResponseEntity<Map<String, Object>> getPublicPortfolio(@PathVariable String slug) {
        return ResponseEntity.ok(portfolioService.getPublicPortfolio(slug));
    }
}
