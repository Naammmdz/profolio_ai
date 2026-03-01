package com.naammm.portfolioservice.controller;

import com.naammm.portfolioservice.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/cv")
@RequiredArgsConstructor
public class CVController {

    private final PortfolioService portfolioService;

    /**
     * POST /api/v1/cv/ingest
     * 
     * Handles CV Upload and Text Extraction.
     * Extracts user ID from JWT Token.
     */
    @PostMapping("/ingest")
    public ResponseEntity<?> uploadCV(
            @AuthenticationPrincipal Jwt jwt, 
            @RequestParam("file") MultipartFile file
    ) {
        try {
            // Assuming "sub" or "userId" is the subject of the JWT
            UUID userId = UUID.fromString(jwt.getSubject());
            
            portfolioService.ingestCV(userId, file);
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "CV successfully processed and added to your personality context."
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "An error occurred while processing the CV: " + e.getMessage()
            ));
        }
    }
}
