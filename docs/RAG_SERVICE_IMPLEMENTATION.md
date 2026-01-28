# RAG Service Implementation Guide

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

```bash
cd profolio-be
mkdir RAGService
cd RAGService
```

**pom.xml dependencies:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.5.6</version>
        <relativePath/>
    </parent>
    
    <groupId>com.naammm</groupId>
    <artifactId>rag-service</artifactId>
    <version>1.0.0</version>
    <name>RAG Service</name>
    
    <properties>
        <java.version>21</java.version>
    </properties>
    
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
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-amqp</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.flywaydb</groupId>
            <artifactId>flyway-database-postgresql</artifactId>
        </dependency>
        
        <!-- Vector Database Client -->
        <dependency>
            <groupId>io.qdrant</groupId>
            <artifactId>qdrant-java-client</artifactId>
            <version>1.7.0</version>
        </dependency>
        
        <!-- OpenAI Client -->
        <dependency>
            <groupId>com.theokanning.openai-gpt3-java</groupId>
            <artifactId>service</artifactId>
            <version>0.18.2</version>
        </dependency>
        
        <!-- JSON Processing -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.datatype</groupId>
            <artifactId>jackson-datatype-jsr310</artifactId>
        </dependency>
        
        <!-- Utilities -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-text</artifactId>
            <version>1.11.0</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.testcontainers</groupId>
            <artifactId>postgresql</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 1.2 Application Configuration

**application.yml:**

```yaml
server:
  port: 8084

spring:
  application:
    name: rag-service
  
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/profolio}
    username: ${DATABASE_USERNAME:profolio}
    password: ${DATABASE_PASSWORD:profolio}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
  
  rabbitmq:
    host: ${RABBITMQ_HOST:localhost}
    port: ${RABBITMQ_PORT:5672}
    username: ${RABBITMQ_USERNAME:guest}
    password: ${RABBITMQ_PASSWORD:guest}

# RAG Configuration
rag:
  openai:
    api-key: ${RAG_OPENAI_API_KEY:}
    embedding-model: ${RAG_EMBEDDING_MODEL:text-embedding-3-small}
    embedding-dimension: ${RAG_EMBEDDING_DIMENSION:1536}
    chat-model: ${RAG_LLM_MODEL:gpt-4-turbo-preview}
    temperature: ${RAG_TEMPERATURE:0.7}
    max-tokens: ${RAG_MAX_TOKENS:1000}
  
  vector-db:
    url: ${RAG_VECTOR_DB_URL:http://localhost:6333}
    collection-name: ${RAG_COLLECTION_NAME:portfolio_chunks}
    api-key: ${RAG_VECTOR_DB_API_KEY:}
  
  chunking:
    chunk-size: ${RAG_CHUNK_SIZE:500}
    chunk-overlap: ${RAG_CHUNK_OVERLAP:50}
  
  retrieval:
    top-k: ${RAG_TOP_K:5}
    min-relevance: ${RAG_MIN_RELEVANCE:0.7}

# Logging
logging:
  level:
    com.naammm.rag: DEBUG
    org.springframework.web: INFO
```

---

## 2. Database Schema

### 2.1 Flyway Migration

**V1__create_rag_tables.sql:**

```sql
-- Document chunks metadata
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    chunk_type VARCHAR(50) NOT NULL,
    chunk_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    vector_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT document_chunks_type_check CHECK (
        chunk_type IN ('personal_info', 'project', 'skill_category', 
                      'ai_personality', 'contact', 'resume', 'qa')
    ),
    CONSTRAINT document_chunks_unique UNIQUE (portfolio_id, chunk_type, chunk_id)
);

CREATE INDEX idx_document_chunks_portfolio_id ON document_chunks(portfolio_id);
CREATE INDEX idx_document_chunks_type ON document_chunks(chunk_type);
CREATE INDEX idx_document_chunks_chunk_id ON document_chunks(chunk_id);
CREATE INDEX idx_document_chunks_vector_id ON document_chunks(vector_id) WHERE vector_id IS NOT NULL;

-- Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    visitor_id VARCHAR(255),
    visitor_ip VARCHAR(45),
    visitor_location VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP,
    message_count INTEGER DEFAULT 0
);

CREATE INDEX idx_chat_sessions_portfolio_id ON chat_sessions(portfolio_id);
CREATE INDEX idx_chat_sessions_visitor_id ON chat_sessions(visitor_id);
CREATE INDEX idx_chat_sessions_started_at ON chat_sessions(started_at DESC);

-- Extend messages table
ALTER TABLE messages ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES chat_sessions(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS context_chunks JSONB;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS response_time_ms INTEGER;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS tokens_used INTEGER;

CREATE INDEX idx_messages_session_id ON messages(session_id) WHERE session_id IS NOT NULL;

-- RAG initialization status
CREATE TABLE IF NOT EXISTS rag_initialization_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    total_chunks INTEGER DEFAULT 0,
    processed_chunks INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    CONSTRAINT rag_init_status_check CHECK (
        status IN ('pending', 'processing', 'completed', 'failed')
    ),
    CONSTRAINT rag_init_portfolio_unique UNIQUE (portfolio_id)
);

CREATE INDEX idx_rag_init_status ON rag_initialization_status(status);
```

---

## 3. Core Components

### 3.1 Entity Classes

**DocumentChunk.java:**

```java
package com.naammm.rag.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "document_chunks", 
       uniqueConstraints = @UniqueConstraint(
           columnNames = {"portfolio_id", "chunk_type", "chunk_id"}
       ))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentChunk {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "portfolio_id", nullable = false)
    private UUID portfolioId;
    
    @Column(name = "chunk_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ChunkType chunkType;
    
    @Column(name = "chunk_id", nullable = false, length = 255)
    private String chunkId;
    
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "metadata", columnDefinition = "JSONB")
    private String metadata; // JSON string
    
    @Column(name = "vector_id", length = 255)
    private String vectorId;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    public enum ChunkType {
        PERSONAL_INFO,
        PROJECT,
        SKILL_CATEGORY,
        AI_PERSONALITY,
        CONTACT,
        RESUME,
        QA
    }
}
```

**ChatSession.java:**

```java
package com.naammm.rag.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_sessions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "portfolio_id", nullable = false)
    private UUID portfolioId;
    
    @Column(name = "visitor_id", length = 255)
    private String visitorId;
    
    @Column(name = "visitor_ip", length = 45)
    private String visitorIp;
    
    @Column(name = "visitor_location", length = 255)
    private String visitorLocation;
    
    @CreationTimestamp
    @Column(name = "started_at", nullable = false, updatable = false)
    private LocalDateTime startedAt;
    
    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;
    
    @Column(name = "message_count", nullable = false)
    @Builder.Default
    private Integer messageCount = 0;
}
```

### 3.2 Service Interfaces

**RAGService.java:**

```java
package com.naammm.rag.service;

import com.naammm.rag.dto.ChatRequest;
import com.naammm.rag.dto.ChatResponse;
import com.naammm.rag.dto.InitializationStatus;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

public interface RAGService {
    
    /**
     * Initialize RAG for a portfolio
     * Creates chunks and embeddings for all portfolio data
     */
    CompletableFuture<InitializationStatus> initializePortfolioRAG(UUID portfolioId);
    
    /**
     * Update RAG chunks when portfolio data changes
     */
    CompletableFuture<Void> updatePortfolioChunks(UUID portfolioId);
    
    /**
     * Chat with AI using RAG
     */
    CompletableFuture<ChatResponse> chat(UUID portfolioId, ChatRequest request);
    
    /**
     * Get initialization status
     */
    InitializationStatus getInitializationStatus(UUID portfolioId);
    
    /**
     * Delete all chunks for a portfolio
     */
    void deletePortfolioRAG(UUID portfolioId);
    
    /**
     * Rebuild RAG index (admin function)
     */
    CompletableFuture<InitializationStatus> rebuildRAG(UUID portfolioId);
}
```

**ChunkingService.java:**

```java
package com.naammm.rag.service;

import com.naammm.rag.entity.DocumentChunk;
import com.naammm.rag.model.PortfolioData;

import java.util.List;
import java.util.UUID;

public interface ChunkingService {
    
    /**
     * Create chunks from portfolio data
     */
    List<DocumentChunk> createChunks(UUID portfolioId, PortfolioData portfolioData);
    
    /**
     * Update chunks for specific data type
     */
    List<DocumentChunk> updateChunksForType(
        UUID portfolioId, 
        DocumentChunk.ChunkType chunkType, 
        Object data
    );
    
    /**
     * Delete chunks for specific type
     */
    void deleteChunksForType(UUID portfolioId, DocumentChunk.ChunkType chunkType);
}
```

**EmbeddingService.java:**

```java
package com.naammm.rag.service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface EmbeddingService {
    
    /**
     * Generate embedding for a single text
     */
    CompletableFuture<List<Float>> generateEmbedding(String text);
    
    /**
     * Generate embeddings for multiple texts (batch)
     */
    CompletableFuture<List<List<Float>>> generateEmbeddings(List<String> texts);
    
    /**
     * Get embedding dimension
     */
    int getEmbeddingDimension();
}
```

**VectorStoreService.java:**

```java
package com.naammm.rag.service;

import com.naammm.rag.entity.DocumentChunk;
import com.naammm.rag.model.RetrievedChunk;

import java.util.List;
import java.util.UUID;

public interface VectorStoreService {
    
    /**
     * Store chunk with embedding in vector DB
     */
    void storeChunk(DocumentChunk chunk, List<Float> embedding);
    
    /**
     * Retrieve similar chunks
     */
    List<RetrievedChunk> retrieveSimilar(
        UUID portfolioId, 
        List<Float> queryEmbedding, 
        int topK, 
        double minRelevance
    );
    
    /**
     * Delete chunk from vector DB
     */
    void deleteChunk(String vectorId);
    
    /**
     * Delete all chunks for a portfolio
     */
    void deletePortfolioChunks(UUID portfolioId);
    
    /**
     * Check if collection exists
     */
    boolean collectionExists();
    
    /**
     * Create collection if not exists
     */
    void ensureCollection();
}
```

**LLMService.java:**

```java
package com.naammm.rag.service;

import com.naammm.rag.dto.ChatRequest;
import com.naammm.rag.model.RetrievedChunk;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface LLMService {
    
    /**
     * Generate chat response using retrieved context
     */
    CompletableFuture<String> generateResponse(
        String systemPrompt,
        List<RetrievedChunk> context,
        String userQuestion
    );
    
    /**
     * Stream chat response
     */
    CompletableFuture<Void> streamResponse(
        String systemPrompt,
        List<RetrievedChunk> context,
        String userQuestion,
        java.util.function.Consumer<String> onChunk
    );
}
```

---

## 4. Implementation Details

### 4.1 ChunkingService Implementation

**ChunkingServiceImpl.java:**

```java
package com.naammm.rag.service.impl;

import com.naammm.rag.entity.DocumentChunk;
import com.naammm.rag.model.PortfolioData;
import com.naammm.rag.service.ChunkingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChunkingServiceImpl implements ChunkingService {
    
    private final TextChunkingUtil textChunkingUtil;
    
    @Override
    public List<DocumentChunk> createChunks(UUID portfolioId, PortfolioData portfolioData) {
        List<DocumentChunk> chunks = new ArrayList<>();
        
        // Personal Info chunk
        if (portfolioData.getPersonalInfo() != null) {
            chunks.add(createPersonalInfoChunk(portfolioId, portfolioData.getPersonalInfo()));
        }
        
        // Project chunks
        if (portfolioData.getProjects() != null) {
            portfolioData.getProjects().forEach(project -> {
                chunks.add(createProjectChunk(portfolioId, project));
            });
        }
        
        // Skill category chunks
        if (portfolioData.getSkillCategories() != null) {
            portfolioData.getSkillCategories().forEach(category -> {
                chunks.add(createSkillCategoryChunk(portfolioId, category));
            });
        }
        
        // AI Personality chunks
        if (portfolioData.getAiPersonality() != null) {
            chunks.addAll(createAIPersonalityChunks(portfolioId, portfolioData.getAiPersonality()));
        }
        
        // Contact chunk
        if (portfolioData.getContactInfo() != null) {
            chunks.add(createContactChunk(portfolioId, portfolioData.getContactInfo()));
        }
        
        // Resume chunk (if exists)
        if (portfolioData.getResume() != null) {
            chunks.addAll(createResumeChunks(portfolioId, portfolioData.getResume()));
        }
        
        return chunks;
    }
    
    private DocumentChunk createPersonalInfoChunk(UUID portfolioId, PersonalInfo personalInfo) {
        StringBuilder content = new StringBuilder();
        content.append("Personal Information:\n");
        if (personalInfo.getName() != null) {
            content.append("Name: ").append(personalInfo.getName()).append("\n");
        }
        if (personalInfo.getAge() != null) {
            content.append("Age: ").append(personalInfo.getAge()).append("\n");
        }
        if (personalInfo.getLocation() != null) {
            content.append("Location: ").append(personalInfo.getLocation()).append("\n");
        }
        if (personalInfo.getIntroduction() != null) {
            content.append("Introduction: ").append(personalInfo.getIntroduction()).append("\n");
        }
        if (personalInfo.getTags() != null && !personalInfo.getTags().isEmpty()) {
            content.append("Tags: ").append(String.join(", ", personalInfo.getTags()));
        }
        
        return DocumentChunk.builder()
            .portfolioId(portfolioId)
            .chunkType(DocumentChunk.ChunkType.PERSONAL_INFO)
            .chunkId("personal_info_" + portfolioId)
            .content(content.toString())
            .metadata(buildMetadata("Personal Information", personalInfo))
            .build();
    }
    
    private DocumentChunk createProjectChunk(UUID portfolioId, Project project) {
        StringBuilder content = new StringBuilder();
        content.append("Project: ").append(project.getTitle()).append("\n");
        if (project.getCategory() != null) {
            content.append("Category: ").append(project.getCategory()).append("\n");
        }
        if (project.getDescription() != null) {
            content.append("Description: ").append(project.getDescription()).append("\n");
        }
        if (project.getDate() != null) {
            content.append("Date: ").append(project.getDate()).append("\n");
        }
        if (project.getTags() != null && !project.getTags().isEmpty()) {
            content.append("Technologies: ").append(String.join(", ", project.getTags()));
        }
        
        return DocumentChunk.builder()
            .portfolioId(portfolioId)
            .chunkType(DocumentChunk.ChunkType.PROJECT)
            .chunkId("project_" + project.getId())
            .content(content.toString())
            .metadata(buildMetadata("Project", project))
            .build();
    }
    
    // Similar methods for other chunk types...
    
    private List<DocumentChunk> createResumeChunks(UUID portfolioId, Resume resume) {
        // Split resume text into chunks if too long
        String resumeText = resume.getExtractedText();
        return textChunkingUtil.splitIntoChunks(
            resumeText,
            portfolioId,
            DocumentChunk.ChunkType.RESUME,
            "resume_" + portfolioId
        );
    }
    
    private String buildMetadata(String title, Object data) {
        // Convert to JSON string
        // Use Jackson ObjectMapper
        return "{\"title\":\"" + title + "\"}";
    }
}
```

### 4.2 EmbeddingService Implementation

**EmbeddingServiceImpl.java:**

```java
package com.naammm.rag.service.impl;

import com.naammm.rag.service.EmbeddingService;
import com.theokanning.openai.service.OpenAiService;
import com.theokanning.openai.embedding.Embedding;
import com.theokanning.openai.embedding.EmbeddingRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmbeddingServiceImpl implements EmbeddingService {
    
    private final OpenAiService openAiService;
    
    @Value("${rag.openai.embedding-model}")
    private String embeddingModel;
    
    @Value("${rag.openai.embedding-dimension}")
    private int embeddingDimension;
    
    @Override
    public CompletableFuture<List<Float>> generateEmbedding(String text) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                EmbeddingRequest request = EmbeddingRequest.builder()
                    .model(embeddingModel)
                    .input(List.of(text))
                    .build();
                
                List<Embedding> embeddings = openAiService.createEmbeddings(request).getData();
                return embeddings.get(0).getEmbedding();
            } catch (Exception e) {
                log.error("Error generating embedding", e);
                throw new RuntimeException("Failed to generate embedding", e);
            }
        });
    }
    
    @Override
    public CompletableFuture<List<List<Float>>> generateEmbeddings(List<String> texts) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                EmbeddingRequest request = EmbeddingRequest.builder()
                    .model(embeddingModel)
                    .input(texts)
                    .build();
                
                List<Embedding> embeddings = openAiService.createEmbeddings(request).getData();
                return embeddings.stream()
                    .map(Embedding::getEmbedding)
                    .collect(Collectors.toList());
            } catch (Exception e) {
                log.error("Error generating embeddings", e);
                throw new RuntimeException("Failed to generate embeddings", e);
            }
        });
    }
    
    @Override
    public int getEmbeddingDimension() {
        return embeddingDimension;
    }
}
```

### 4.3 VectorStoreService Implementation

**VectorStoreServiceImpl.java:**

```java
package com.naammm.rag.service.impl;

import com.naammm.rag.entity.DocumentChunk;
import com.naammm.rag.model.RetrievedChunk;
import com.naammm.rag.service.VectorStoreService;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Points;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VectorStoreServiceImpl implements VectorStoreService {
    
    private final QdrantClient qdrantClient;
    
    @Value("${rag.vector-db.collection-name}")
    private String collectionName;
    
    @Override
    public void storeChunk(DocumentChunk chunk, List<Float> embedding) {
        try {
            // Convert to Qdrant point
            Points.PointStruct point = Points.PointStruct.newBuilder()
                .setId(Points.PointId.newBuilder()
                    .setUuid(chunk.getId().toString())
                    .build())
                .setVectors(Points.Vectors.newBuilder()
                    .setVector(Points.Vector.newBuilder()
                        .addAllData(embedding)
                        .build())
                    .build())
                .putPayload("portfolio_id", chunk.getPortfolioId().toString())
                .putPayload("chunk_type", chunk.getChunkType().name())
                .putPayload("chunk_id", chunk.getChunkId())
                .putPayload("content", chunk.getContent())
                .putPayload("metadata", chunk.getMetadata())
                .build();
            
            // Upsert point
            qdrantClient.upsert(collectionName, List.of(point));
            
            // Update chunk with vector ID
            chunk.setVectorId(chunk.getId().toString());
            
        } catch (Exception e) {
            log.error("Error storing chunk in vector DB", e);
            throw new RuntimeException("Failed to store chunk", e);
        }
    }
    
    @Override
    public List<RetrievedChunk> retrieveSimilar(
        UUID portfolioId, 
        List<Float> queryEmbedding, 
        int topK, 
        double minRelevance
    ) {
        try {
            // Build search request
            Points.SearchPoints searchRequest = Points.SearchPoints.newBuilder()
                .setCollectionName(collectionName)
                .setVector(Points.Vector.newBuilder()
                    .addAllData(queryEmbedding)
                    .build())
                .setLimit(topK)
                .setScoreThreshold((float) minRelevance)
                .setFilter(Points.Filter.newBuilder()
                    .setMust(List.of(
                        Points.Condition.newBuilder()
                            .setField(Points.FieldCondition.newBuilder()
                                .setKey("portfolio_id")
                                .setMatch(Points.Match.newBuilder()
                                    .setValue(Points.Value.newBuilder()
                                        .setStringValue(portfolioId.toString())
                                        .build())
                                    .build())
                                .build())
                            .build())
                    )
                    .build())
                .build();
            
            // Search
            Points.SearchResponse response = qdrantClient.search(searchRequest);
            
            // Convert to RetrievedChunk
            return response.getResultList().stream()
                .map(point -> RetrievedChunk.builder()
                    .chunkId(point.getPayloadMap().get("chunk_id").getStringValue())
                    .content(point.getPayloadMap().get("content").getStringValue())
                    .relevance(point.getScore())
                    .metadata(point.getPayloadMap().get("metadata").getStringValue())
                    .build())
                .collect(Collectors.toList());
                
        } catch (Exception e) {
            log.error("Error retrieving similar chunks", e);
            throw new RuntimeException("Failed to retrieve chunks", e);
        }
    }
    
    @Override
    public void deleteChunk(String vectorId) {
        try {
            qdrantClient.delete(collectionName, List.of(
                Points.PointId.newBuilder()
                    .setUuid(vectorId)
                    .build()
            ));
        } catch (Exception e) {
            log.error("Error deleting chunk", e);
            throw new RuntimeException("Failed to delete chunk", e);
        }
    }
    
    @Override
    public void deletePortfolioChunks(UUID portfolioId) {
        try {
            // Delete all points for portfolio
            qdrantClient.delete(collectionName, Points.Filter.newBuilder()
                .setMust(List.of(
                    Points.Condition.newBuilder()
                        .setField(Points.FieldCondition.newBuilder()
                            .setKey("portfolio_id")
                            .setMatch(Points.Match.newBuilder()
                                .setValue(Points.Value.newBuilder()
                                    .setStringValue(portfolioId.toString())
                                    .build())
                                .build())
                            .build())
                        .build())
                )
                .build());
        } catch (Exception e) {
            log.error("Error deleting portfolio chunks", e);
            throw new RuntimeException("Failed to delete portfolio chunks", e);
        }
    }
    
    @Override
    public boolean collectionExists() {
        try {
            return qdrantClient.collectionExists(collectionName);
        } catch (Exception e) {
            log.error("Error checking collection existence", e);
            return false;
        }
    }
    
    @Override
    public void ensureCollection() {
        if (!collectionExists()) {
            try {
                qdrantClient.createCollection(collectionName, 
                    io.qdrant.client.grpc.Collections.VectorParams.newBuilder()
                        .setSize(1536) // OpenAI embedding dimension
                        .setDistance(io.qdrant.client.grpc.Collections.Distance.Cosine)
                        .build());
            } catch (Exception e) {
                log.error("Error creating collection", e);
                throw new RuntimeException("Failed to create collection", e);
            }
        }
    }
}
```

---

## 5. API Endpoints

### 5.1 Controller

**RAGController.java:**

```java
package com.naammm.rag.controller;

import com.naammm.rag.dto.ChatRequest;
import com.naammm.rag.dto.ChatResponse;
import com.naammm.rag.dto.InitializationStatus;
import com.naammm.rag.service.RAGService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/rag")
@RequiredArgsConstructor
public class RAGController {
    
    private final RAGService ragService;
    
    @PostMapping("/portfolios/{portfolioId}/initialize")
    public ResponseEntity<InitializationStatus> initializeRAG(
        @PathVariable UUID portfolioId
    ) {
        InitializationStatus status = ragService.initializePortfolioRAG(portfolioId).join();
        return ResponseEntity.accepted().body(status);
    }
    
    @PostMapping("/portfolios/{portfolioId}/chat")
    public ResponseEntity<ChatResponse> chat(
        @PathVariable UUID portfolioId,
        @Valid @RequestBody ChatRequest request
    ) {
        ChatResponse response = ragService.chat(portfolioId, request).join();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/portfolios/{portfolioId}/status")
    public ResponseEntity<InitializationStatus> getStatus(
        @PathVariable UUID portfolioId
    ) {
        InitializationStatus status = ragService.getInitializationStatus(portfolioId);
        return ResponseEntity.ok(status);
    }
    
    @PostMapping("/portfolios/{portfolioId}/rebuild")
    public ResponseEntity<InitializationStatus> rebuildRAG(
        @PathVariable UUID portfolioId
    ) {
        InitializationStatus status = ragService.rebuildRAG(portfolioId).join();
        return ResponseEntity.accepted().body(status);
    }
    
    @DeleteMapping("/portfolios/{portfolioId}")
    public ResponseEntity<Void> deleteRAG(
        @PathVariable UUID portfolioId
    ) {
        ragService.deletePortfolioRAG(portfolioId);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 6. Testing

### 6.1 Unit Tests

**ChunkingServiceTest.java:**

```java
package com.naammm.rag.service.impl;

import com.naammm.rag.entity.DocumentChunk;
import com.naammm.rag.model.PortfolioData;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ChunkingServiceImplTest {
    
    @InjectMocks
    private ChunkingServiceImpl chunkingService;
    
    @Test
    void testCreateChunks() {
        // Given
        UUID portfolioId = UUID.randomUUID();
        PortfolioData portfolioData = new PortfolioData();
        // ... setup test data
        
        // When
        List<DocumentChunk> chunks = chunkingService.createChunks(portfolioId, portfolioData);
        
        // Then
        assertNotNull(chunks);
        assertFalse(chunks.isEmpty());
    }
}
```

---

## 7. Deployment

### 7.1 Dockerfile

```dockerfile
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY target/rag-service-1.0.0.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 7.2 Docker Compose

```yaml
version: '3.8'

services:
  rag-service:
    build: ./RAGService
    ports:
      - "8084:8084"
    environment:
      - DATABASE_URL=jdbc:postgresql://postgres:5432/profolio
      - RAG_OPENAI_API_KEY=${RAG_OPENAI_API_KEY}
      - RAG_VECTOR_DB_URL=http://qdrant:6333
    depends_on:
      - postgres
      - qdrant
  
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_storage:/qdrant/storage

volumes:
  qdrant_storage:
```

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27
