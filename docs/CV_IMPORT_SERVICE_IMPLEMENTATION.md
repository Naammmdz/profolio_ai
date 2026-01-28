# CV Import Service Implementation Guide

## 📋 Table of Contents
1. [Project Setup](#project-setup)
2. [Database Schema](#database-schema)
3. [Core Components](#core-components)
4. [Implementation Details](#implementation-details)
5. [API Endpoints](#api-endpoints)
6. [Testing](#testing)
7. [Deployment](#deployment)

---

## 1. Project Setup

### 1.1 Create Spring Boot Project

**pom.xml dependencies:**

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
    
    <!-- PDF Processing -->
    <dependency>
        <groupId>org.apache.pdfbox</groupId>
        <artifactId>pdfbox</artifactId>
        <version>3.0.1</version>
    </dependency>
    
    <!-- OpenAI Client -->
    <dependency>
        <groupId>com.theokanning.openai-gpt3-java</groupId>
        <artifactId>service</artifactId>
        <version>0.18.2</version>
    </dependency>
    
    <!-- File Storage -->
    <dependency>
        <groupId>io.minio</groupId>
        <artifactId>minio</artifactId>
        <version>8.5.7</version>
    </dependency>
    
    <!-- Rest of dependencies similar to RAG Service -->
</dependencies>
```

### 1.2 Application Configuration

**application.yml:**

```yaml
server:
  port: 8085

spring:
  application:
    name: cv-import-service
  
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

cv-import:
  openai:
    api-key: ${CV_IMPORT_OPENAI_API_KEY:}
    model: ${CV_IMPORT_LLM_MODEL:gpt-4-turbo-preview}
    temperature: 0.3
    max-tokens: 4000
  
  file-storage:
    type: ${FILE_STORAGE_TYPE:minio} # minio or s3
    endpoint: ${FILE_STORAGE_ENDPOINT:http://localhost:9000}
    access-key: ${FILE_STORAGE_ACCESS_KEY:minioadmin}
    secret-key: ${FILE_STORAGE_SECRET_KEY:minioadmin}
    bucket-name: ${FILE_STORAGE_BUCKET:cv-imports}
  
  processing:
    max-file-size: 10485760 # 10MB
    allowed-types: application/pdf
    timeout-seconds: 300
```

---

## 2. Database Schema

### 2.1 Flyway Migration

**V1__create_cv_import_tables.sql:**

```sql
CREATE TABLE IF NOT EXISTS cv_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'processing',
    extracted_data JSONB,
    confirmed_data JSONB,
    error_message TEXT,
    confidence_score DECIMAL(3,2),
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT cv_imports_status_check CHECK (
        status IN ('processing', 'completed', 'failed', 'pending_review')
    ),
    CONSTRAINT cv_imports_confidence_check CHECK (
        confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1)
    )
);

CREATE INDEX idx_cv_imports_portfolio_id ON cv_imports(portfolio_id);
CREATE INDEX idx_cv_imports_status ON cv_imports(status);
CREATE INDEX idx_cv_imports_created_at ON cv_imports(created_at DESC);
```

---

## 3. Core Components

### 3.1 Entity Classes

**CVImport.java:**

```java
package com.naammm.cvimport.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "cv_imports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CVImport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "portfolio_id", nullable = false)
    private UUID portfolioId;
    
    @Column(name = "file_url", nullable = false, columnDefinition = "TEXT")
    private String fileUrl;
    
    @Column(name = "file_name", length = 255)
    private String fileName;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "status", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ImportStatus status = ImportStatus.PROCESSING;
    
    @Column(name = "extracted_data", columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> extractedData;
    
    @Column(name = "confirmed_data", columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> confirmedData;
    
    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
    
    @Column(name = "confidence_score", precision = 3, scale = 2)
    private BigDecimal confidenceScore;
    
    @Column(name = "processing_time_ms")
    private Integer processingTimeMs;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    public enum ImportStatus {
        PROCESSING,
        COMPLETED,
        FAILED,
        PENDING_REVIEW
    }
}
```

### 3.2 DTOs

**CVImportRequest.java:**

```java
package com.naammm.cvimport.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CVImportRequest {
    private MultipartFile file;
    private Boolean autoConfirm; // Auto-confirm if confidence > threshold
}
```

**CVImportResponse.java:**

```java
package com.naammm.cvimport.dto;

import com.naammm.cvimport.entity.CVImport;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CVImportResponse {
    private UUID importId;
    private UUID portfolioId;
    private CVImport.ImportStatus status;
    private Map<String, Object> extractedData;
    private BigDecimal confidenceScore;
    private String errorMessage;
    private Integer estimatedTimeSeconds;
}
```

**CVImportConfirmation.java:**

```java
package com.naammm.cvimport.dto;

import lombok.Data;
import java.util.Map;

@Data
public class CVImportConfirmation {
    private Map<String, Object> personalInfo;
    private Map<String, Object> projects;
    private Map<String, Object> skills;
    private Boolean confirmAll;
}
```

### 3.3 Service Interfaces

**CVImportService.java:**

```java
package com.naammm.cvimport.service;

import com.naammm.cvimport.dto.CVImportConfirmation;
import com.naammm.cvimport.dto.CVImportRequest;
import com.naammm.cvimport.dto.CVImportResponse;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public interface CVImportService {
    
    /**
     * Import CV and extract data
     */
    CompletableFuture<CVImportResponse> importCV(
        UUID portfolioId, 
        CVImportRequest request
    );
    
    /**
     * Get import status
     */
    CVImportResponse getImportStatus(UUID importId);
    
    /**
     * Confirm and apply extracted data
     */
    CompletableFuture<Void> confirmImport(
        UUID importId, 
        CVImportConfirmation confirmation
    );
    
    /**
     * Cancel import
     */
    void cancelImport(UUID importId);
}
```

**PDFExtractionService.java:**

```java
package com.naammm.cvimport.service;

import java.io.InputStream;

public interface PDFExtractionService {
    
    /**
     * Extract text from PDF
     */
    String extractText(InputStream pdfInputStream) throws Exception;
    
    /**
     * Extract text with structure (sections, tables)
     */
    StructuredText extractStructuredText(InputStream pdfInputStream) throws Exception;
}
```

**CVParsingService.java:**

```java
package com.naammm.cvimport.service;

import com.naammm.cvimport.model.ExtractedCVData;

public interface CVParsingService {
    
    /**
     * Parse CV text using LLM
     */
    ExtractedCVData parseCV(String cvText);
    
    /**
     * Get confidence score for extracted data
     */
    double calculateConfidence(ExtractedCVData data);
}
```

**PortfolioPopulationService.java:**

```java
package com.naammm.cvimport.service;

import com.naammm.cvimport.model.ExtractedCVData;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public interface PortfolioPopulationService {
    
    /**
     * Populate portfolio with extracted data
     */
    CompletableFuture<Void> populatePortfolio(
        UUID portfolioId, 
        ExtractedCVData extractedData
    );
}
```

---

## 4. Implementation Details

### 4.1 PDFExtractionService Implementation

**PDFExtractionServiceImpl.java:**

```java
package com.naammm.cvimport.service.impl;

import com.naammm.cvimport.service.PDFExtractionService;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
@Slf4j
public class PDFExtractionServiceImpl implements PDFExtractionService {
    
    @Override
    public String extractText(InputStream pdfInputStream) throws Exception {
        try (PDDocument document = PDDocument.load(pdfInputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setStartPage(1);
            stripper.setEndPage(document.getNumberOfPages());
            
            String text = stripper.getText(document);
            
            // Clean text
            text = cleanText(text);
            
            return text;
        }
    }
    
    @Override
    public StructuredText extractStructuredText(InputStream pdfInputStream) throws Exception {
        // More advanced extraction with structure detection
        // Can use Apache Tika or custom logic
        String text = extractText(pdfInputStream);
        return parseStructure(text);
    }
    
    private String cleanText(String text) {
        // Remove extra whitespace
        text = text.replaceAll("\\s+", " ");
        // Fix common encoding issues
        text = text.replace("â€™", "'");
        text = text.replace("â€œ", "\"");
        text = text.replace("â€", "\"");
        return text.trim();
    }
    
    private StructuredText parseStructure(String text) {
        // Parse into sections (Education, Experience, Skills, etc.)
        // This is a simplified version
        StructuredText structured = new StructuredText();
        // ... parsing logic
        return structured;
    }
}
```

### 4.2 CVParsingService Implementation

**CVParsingServiceImpl.java:**

```java
package com.naammm.cvimport.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.naammm.cvimport.model.ExtractedCVData;
import com.naammm.cvimport.service.CVParsingService;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CVParsingServiceImpl implements CVParsingService {
    
    private final OpenAiService openAiService;
    private final ObjectMapper objectMapper;
    
    @Value("${cv-import.openai.model}")
    private String model;
    
    @Value("${cv-import.openai.temperature}")
    private double temperature;
    
    @Value("${cv-import.openai.max-tokens}")
    private int maxTokens;
    
    private static final String SYSTEM_PROMPT = """
        You are an expert CV/resume parser. Extract structured information from the provided CV text.
        
        Extract the following information:
        1. Personal Information:
           - Full name
           - Email address
           - Phone number
           - Location (city, country)
           - LinkedIn/GitHub URLs
        
        2. Work Experience (convert to Projects):
           - For each role, extract:
             - Project/Company name
             - Role/Title
             - Duration (start date - end date)
             - Description of responsibilities and achievements
             - Technologies/tools used
             - Key accomplishments
        
        3. Skills:
           - Technical skills (programming languages, frameworks, tools)
           - Soft skills
           - Group by category (Languages, Frameworks, Databases, Tools, etc.)
        
        4. Education:
           - Degree, institution, graduation year
        
        5. Certifications:
           - Certification name, issuer, date
        
        Return the result as a valid JSON object matching this schema:
        {
          "personalInfo": {
            "name": "string",
            "email": "string",
            "phone": "string",
            "location": "string",
            "socialLinks": [{"platform": "string", "url": "string"}]
          },
          "projects": [{
            "title": "string",
            "category": "string",
            "description": "string",
            "date": "string",
            "tags": ["string"],
            "links": [{"name": "string", "url": "string"}]
          }],
          "skills": [{
            "category": "string",
            "skills": ["string"]
          }],
          "education": [{
            "degree": "string",
            "institution": "string",
            "year": "string"
          }],
          "certifications": [{
            "name": "string",
            "issuer": "string",
            "date": "string"
          }]
        }
        """;
    
    @Override
    public ExtractedCVData parseCV(String cvText) {
        try {
            ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model(model)
                .temperature(temperature)
                .maxTokens(maxTokens)
                .messages(List.of(
                    new ChatMessage("system", SYSTEM_PROMPT),
                    new ChatMessage("user", "Extract information from this CV:\n\n" + cvText)
                ))
                .responseFormat(ChatCompletionRequest.ResponseFormat.JSON_OBJECT)
                .build();
            
            String response = openAiService.createChatCompletion(request)
                .getChoices()
                .get(0)
                .getMessage()
                .getContent();
            
            // Parse JSON response
            ExtractedCVData data = objectMapper.readValue(response, ExtractedCVData.class);
            
            return data;
            
        } catch (Exception e) {
            log.error("Error parsing CV", e);
            throw new RuntimeException("Failed to parse CV", e);
        }
    }
    
    @Override
    public double calculateConfidence(ExtractedCVData data) {
        // Calculate confidence based on:
        // - Completeness of data
        // - Presence of key fields
        // - Data quality indicators
        
        double confidence = 0.0;
        int factors = 0;
        
        if (data.getPersonalInfo() != null && data.getPersonalInfo().getName() != null) {
            confidence += 0.2;
            factors++;
        }
        
        if (data.getProjects() != null && !data.getProjects().isEmpty()) {
            confidence += 0.3;
            factors++;
        }
        
        if (data.getSkills() != null && !data.getSkills().isEmpty()) {
            confidence += 0.3;
            factors++;
        }
        
        if (data.getPersonalInfo() != null && data.getPersonalInfo().getEmail() != null) {
            confidence += 0.2;
            factors++;
        }
        
        return factors > 0 ? confidence : 0.0;
    }
}
```

### 4.3 PortfolioPopulationService Implementation

**PortfolioPopulationServiceImpl.java:**

```java
package com.naammm.cvimport.service.impl;

import com.naammm.cvimport.model.ExtractedCVData;
import com.naammm.cvimport.service.PortfolioPopulationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class PortfolioPopulationServiceImpl implements PortfolioPopulationService {
    
    private final RestTemplate restTemplate;
    
    @Value("${services.portfolio-service.url:http://localhost:8081}")
    private String portfolioServiceUrl;
    
    @Value("${services.tools-service.url:http://localhost:8083}")
    private String toolsServiceUrl;
    
    @Value("${services.content-service.url:http://localhost:8082}")
    private String contentServiceUrl;
    
    @Override
    public CompletableFuture<Void> populatePortfolio(
        UUID portfolioId, 
        ExtractedCVData extractedData
    ) {
        return CompletableFuture.runAsync(() -> {
            try {
                // 1. Update Personal Info
                if (extractedData.getPersonalInfo() != null) {
                    updatePersonalInfo(portfolioId, extractedData.getPersonalInfo());
                }
                
                // 2. Create Projects
                if (extractedData.getProjects() != null) {
                    createProjects(portfolioId, extractedData.getProjects());
                }
                
                // 3. Create Skill Categories
                if (extractedData.getSkills() != null) {
                    createSkillCategories(portfolioId, extractedData.getSkills());
                }
                
                // 4. Update Contact Info
                if (extractedData.getPersonalInfo() != null) {
                    updateContactInfo(portfolioId, extractedData.getPersonalInfo());
                }
                
                log.info("Successfully populated portfolio: {}", portfolioId);
                
            } catch (Exception e) {
                log.error("Error populating portfolio", e);
                throw new RuntimeException("Failed to populate portfolio", e);
            }
        });
    }
    
    private void updatePersonalInfo(UUID portfolioId, ExtractedCVData.PersonalInfo personalInfo) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", personalInfo.getName());
        request.put("location", personalInfo.getLocation());
        request.put("introduction", buildIntroduction(personalInfo));
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        
        restTemplate.exchange(
            toolsServiceUrl + "/api/portfolios/" + portfolioId + "/personal-info",
            HttpMethod.PUT,
            entity,
            Void.class
        );
    }
    
    private void createProjects(UUID portfolioId, List<ExtractedCVData.Project> projects) {
        for (ExtractedCVData.Project project : projects) {
            Map<String, Object> request = new HashMap<>();
            request.put("title", project.getTitle());
            request.put("category", project.getCategory() != null ? project.getCategory() : "Work Experience");
            request.put("description", project.getDescription());
            request.put("date", project.getDate());
            request.put("tags", project.getTags());
            request.put("links", project.getLinks());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            restTemplate.exchange(
                contentServiceUrl + "/api/portfolios/" + portfolioId + "/projects",
                HttpMethod.POST,
                entity,
                Void.class
            );
        }
    }
    
    private void createSkillCategories(UUID portfolioId, List<ExtractedCVData.SkillCategory> skillCategories) {
        for (ExtractedCVData.SkillCategory category : skillCategories) {
            Map<String, Object> request = new HashMap<>();
            request.put("title", category.getCategory());
            request.put("skills", category.getSkills());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            restTemplate.exchange(
                contentServiceUrl + "/api/portfolios/" + portfolioId + "/skill-categories",
                HttpMethod.POST,
                entity,
                Void.class
            );
        }
    }
    
    private void updateContactInfo(UUID portfolioId, ExtractedCVData.PersonalInfo personalInfo) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", personalInfo.getName());
        request.put("email", personalInfo.getEmail());
        request.put("phone", personalInfo.getPhone());
        request.put("socialLinks", personalInfo.getSocialLinks());
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
        
        restTemplate.exchange(
            toolsServiceUrl + "/api/portfolios/" + portfolioId + "/contact",
            HttpMethod.PUT,
            entity,
            Void.class
        );
    }
    
    private String buildIntroduction(ExtractedCVData.PersonalInfo personalInfo) {
        // Build introduction from available data
        StringBuilder intro = new StringBuilder();
        if (personalInfo.getName() != null) {
            intro.append("I'm ").append(personalInfo.getName());
        }
        // Add more based on available data
        return intro.toString();
    }
}
```

---

## 5. API Endpoints

### 5.1 Controller

**CVImportController.java:**

```java
package com.naammm.cvimport.controller;

import com.naammm.cvimport.dto.CVImportConfirmation;
import com.naammm.cvimport.dto.CVImportRequest;
import com.naammm.cvimport.dto.CVImportResponse;
import com.naammm.cvimport.service.CVImportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cv-import")
@RequiredArgsConstructor
public class CVImportController {
    
    private final CVImportService cvImportService;
    
    @PostMapping("/portfolios/{portfolioId}/import")
    public ResponseEntity<CVImportResponse> importCV(
        @PathVariable UUID portfolioId,
        @Valid @ModelAttribute CVImportRequest request
    ) {
        CVImportResponse response = cvImportService.importCV(portfolioId, request).join();
        return ResponseEntity.accepted().body(response);
    }
    
    @GetMapping("/imports/{importId}")
    public ResponseEntity<CVImportResponse> getImportStatus(
        @PathVariable UUID importId
    ) {
        CVImportResponse response = cvImportService.getImportStatus(importId);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/imports/{importId}/confirm")
    public ResponseEntity<Void> confirmImport(
        @PathVariable UUID importId,
        @Valid @RequestBody CVImportConfirmation confirmation
    ) {
        cvImportService.confirmImport(importId, confirmation).join();
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/imports/{importId}")
    public ResponseEntity<Void> cancelImport(
        @PathVariable UUID importId
    ) {
        cvImportService.cancelImport(importId);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 6. Testing

### 6.1 Integration Test

**CVImportIntegrationTest.java:**

```java
package com.naammm.cvimport.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class CVImportIntegrationTest {
    
    @Test
    void testFullImportFlow() {
        // Test complete CV import flow
    }
}
```

---

## 7. Deployment

Similar to RAG Service deployment with Docker and Docker Compose.

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27
