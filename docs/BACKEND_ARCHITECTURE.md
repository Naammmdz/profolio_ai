# Profolio Backend Architecture Design

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Service Architecture](#service-architecture)
4. [RAG Service Design](#rag-service-design)
5. [CV Import Service Design](#cv-import-service-design)
6. [Database Design](#database-design)
7. [API Design](#api-design)
8. [Technology Stack](#technology-stack)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Security Considerations](#security-considerations)

---

## 1. System Overview

### 1.1 Business Requirements

**Core Features:**
- Users create AI-powered portfolios with personalized AI twins
- AI twins can answer questions about users using RAG (Retrieval-Augmented Generation)
- Users can import CV/Resume (PDF) to auto-populate portfolio data
- Real-time chat interface for visitors to interact with AI twins
- Analytics and tracking for portfolio interactions

### 1.2 System Goals

- **Scalability**: Support thousands of concurrent AI chat sessions
- **Performance**: Sub-second response time for AI queries
- **Reliability**: 99.9% uptime for portfolio access
- **Security**: Secure user data and AI interactions
- **Maintainability**: Clean architecture with separation of concerns

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│                    http://localhost:3000                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (AGW)                          │
│                    http://localhost:8080                         │
│  - Routing                                                       │
│  - Authentication (JWT validation)                               │
│  - Rate Limiting                                                 │
└─────────────┬───────────────────────────────────────────────────┘
              │
    ┌─────────┴─────────┬──────────────┬──────────────┬────────────┐
    │                  │              │              │            │
    ▼                  ▼              ▼              ▼            ▼
┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│Portfolio │  │   Content    │  │   Tools  │  │   RAG    │  │   CV     │
│ Service  │  │   Service    │  │  Service │  │  Service  │  │  Service │
│  :8081   │  │    :8082     │  │  :8083   │  │  :8084   │  │  :8085   │
└────┬─────┘  └──────┬───────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │               │               │             │             │
     │               │               │             │             │
     └───────┬───────┴───────┬───────┴─────────────┴─────────────┘
             │               │
             ▼               ▼
    ┌─────────────────────────────────────┐
    │      PostgreSQL (Main DB)           │
    │  - Users, Portfolios, Content        │
    │  - Settings, Analytics               │
    └─────────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │    Vector Database (Qdrant/PGVector) │
    │  - Document Embeddings               │
    │  - Semantic Search                   │
    └─────────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │      AI/LLM Service (OpenAI/        │
    │      Gemini/Anthropic)               │
    │  - Chat Completion                   │
    │  - Embeddings                        │
    └─────────────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │      File Storage (S3/MinIO)         │
    │  - CV/Resume PDFs                    │
    │  - Images, Videos                    │
    └─────────────────────────────────────┘
```

---

## 3. Service Architecture

### 3.1 Microservices Overview

| Service | Port | Responsibility | Database |
|---------|------|---------------|----------|
| **AGW** | 8080 | API Gateway, Routing, Auth | - |
| **AuthorizationServer** | 9000 | OAuth2/OIDC, User Auth | PostgreSQL |
| **PortfolioService** | 8081 | Portfolio CRUD, Settings | PostgreSQL |
| **ContentService** | 8082 | Projects, Skills, Questions | PostgreSQL |
| **ToolsService** | 8083 | Personal Info, Contact, etc. | PostgreSQL |
| **RAGService** | 8084 | RAG Pipeline, AI Chat | PostgreSQL + Vector DB |
| **CVImportService** | 8085 | CV Parsing, Data Extraction | PostgreSQL |
| **FileService** | 8086 | File Upload/Download | S3/MinIO |
| **AnalyticsService** | 8087 | Analytics, Tracking | PostgreSQL |

### 3.2 Service Communication

- **Synchronous**: REST API calls via API Gateway
- **Asynchronous**: Message Queue (RabbitMQ/Kafka) for:
  - CV processing tasks
  - Embedding generation
  - Analytics events

---

## 4. RAG Service Design

### 4.1 Overview

RAG Service is responsible for:
1. **Document Chunking**: Split user portfolio data into semantic chunks
2. **Embedding Generation**: Convert chunks to vector embeddings
3. **Vector Storage**: Store embeddings in vector database
4. **Retrieval**: Semantic search for relevant context
5. **AI Chat**: Generate responses using retrieved context

### 4.2 RAG Pipeline Flow

```
User Question
    │
    ▼
┌─────────────────────────────────────┐
│  1. Question Embedding              │
│     - Convert question to vector    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Semantic Search                  │
│     - Search vector DB for relevant  │
│       chunks (top-k retrieval)      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. Context Assembly                 │
│     - Combine retrieved chunks      │
│     - Add metadata (source, type)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. LLM Prompt Construction          │
│     - Build prompt with:            │
│       - System prompt (AI personality)│
│       - Retrieved context            │
│       - User question                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  5. LLM Generation                   │
│     - Call OpenAI/Gemini API         │
│     - Stream response to client      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  6. Response & Logging               │
│     - Return response                │
│     - Log interaction                │
│     - Update analytics               │
└─────────────────────────────────────┘
```

### 4.3 Document Chunking Strategy

**Chunk Types:**

1. **Personal Info Chunk**
   - Name, age, location, introduction
   - Tags, presentation photo description
   - Chunk ID: `personal_info_{portfolioId}`

2. **Project Chunks** (one per project)
   - Title, category, description, date
   - Tags, links, technologies used
   - Chunk ID: `project_{projectId}`

3. **Skill Category Chunks** (one per category)
   - Category title, list of skills
   - Chunk ID: `skill_category_{categoryId}`

4. **AI Personality Chunks**
   - Professional identity (what you do, skills, flex)
   - Personal side (what drives you, outside work, unique)
   - Communication style
   - Personal touch (free-form text)
   - Chunk ID: `ai_personality_{portfolioId}`

5. **Question-Answer Chunks** (optional)
   - Pre-defined Q&A pairs from suggested questions
   - Chunk ID: `qa_{questionId}`

6. **Contact Info Chunk**
   - Name, email, phone, social links
   - Chunk ID: `contact_{portfolioId}`

7. **Resume Chunk** (if uploaded)
   - Extracted text from PDF
   - Chunk ID: `resume_{portfolioId}`

**Chunking Rules:**
- Max chunk size: 500 tokens
- Overlap: 50 tokens between chunks
- Metadata: Include source type, portfolio ID, timestamp

### 4.4 Vector Database Schema

**Collection: `portfolio_chunks`**

```json
{
  "id": "uuid",
  "portfolio_id": "uuid",
  "chunk_type": "personal_info | project | skill_category | ai_personality | contact | resume | qa",
  "chunk_id": "string", // e.g., "project_123"
  "content": "text",
  "metadata": {
    "source": "string",
    "title": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  },
  "embedding": [0.123, 0.456, ...], // 1536-dim vector (OpenAI) or 768-dim (sentence-transformers)
  "created_at": "timestamp"
}
```

**Indexes:**
- Vector index: HNSW (Hierarchical Navigable Small World)
- Metadata index: `portfolio_id`, `chunk_type`

### 4.5 Embedding Model

**Options:**
1. **OpenAI `text-embedding-3-small`** (1536 dimensions)
   - Best quality, requires API key
   - Cost: ~$0.02 per 1M tokens

2. **Sentence Transformers `all-MiniLM-L6-v2`** (384 dimensions)
   - Free, self-hosted
   - Good quality for most use cases

3. **Google `text-embedding-004`** (768 dimensions)
   - Good balance of quality and cost

**Recommendation**: Start with OpenAI for production, migrate to self-hosted if cost becomes an issue.

### 4.6 RAG Service Components

**Java Classes:**

```java
// Core Components
- RAGService (Main service)
- ChunkingService (Document chunking)
- EmbeddingService (Generate embeddings)
- VectorStoreService (Vector DB operations)
- RetrievalService (Semantic search)
- LLMService (AI chat completion)
- PromptBuilder (Construct prompts)
```

**Key Methods:**

```java
public interface RAGService {
    // Initialize RAG for a portfolio
    void initializePortfolioRAG(UUID portfolioId);
    
    // Update chunks when portfolio data changes
    void updatePortfolioChunks(UUID portfolioId);
    
    // Chat with AI
    CompletableFuture<Stream<String>> chat(
        UUID portfolioId, 
        String question, 
        String visitorId
    );
    
    // Delete all chunks for a portfolio
    void deletePortfolioRAG(UUID portfolioId);
}
```

---

## 5. CV Import Service Design

### 5.1 Overview

CV Import Service extracts structured data from PDF resumes/CVs and populates portfolio automatically.

### 5.2 CV Processing Pipeline

```
PDF Upload
    │
    ▼
┌─────────────────────────────────────┐
│  1. PDF Text Extraction              │
│     - Extract text using Apache PDFBox│
│     - Handle tables, lists, sections  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Text Cleaning & Normalization     │
│     - Remove extra whitespace        │
│     - Fix encoding issues            │
│     - Normalize dates, phone numbers  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. LLM-Based Information Extraction │
│     - Use GPT-4/Gemini to extract:   │
│       - Personal Info (name, email,  │
│         phone, location)             │
│       - Work Experience (projects)   │
│       - Skills (technical, soft)     │
│       - Education                    │
│       - Certifications               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. Data Validation & Enrichment     │
│     - Validate extracted data        │
│     - Enrich with external APIs      │
│       (e.g., skill categorization)   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  5. Portfolio Data Population        │
│     - Create/Update:                 │
│       - Personal Info                │
│       - Projects                      │
│       - Skill Categories              │
│       - Contact Info                  │
│     - Store PDF in FileService        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  6. RAG Chunking                     │
│     - Trigger RAGService to chunk     │
│       new data                        │
└─────────────────────────────────────┘
```

### 5.3 LLM Prompt for CV Extraction

**System Prompt:**
```
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
```

### 5.4 CV Import Service Components

**Java Classes:**

```java
// Core Components
- CVImportService (Main service)
- PDFExtractionService (Extract text from PDF)
- TextCleaningService (Clean and normalize text)
- CVParsingService (LLM-based extraction)
- DataValidationService (Validate extracted data)
- PortfolioPopulationService (Populate portfolio data)
```

**Key Methods:**

```java
public interface CVImportService {
    // Process CV and populate portfolio
    CompletableFuture<CVImportResult> importCV(
        UUID portfolioId, 
        MultipartFile cvFile
    );
    
    // Get import status
    CVImportStatus getImportStatus(UUID importId);
    
    // Review and confirm extracted data
    void confirmImport(UUID importId, CVImportConfirmation confirmation);
}
```

### 5.5 Database Schema for CV Import

```sql
CREATE TABLE cv_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'processing',
    extracted_data JSONB,
    confirmed_data JSONB,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT cv_imports_status_check CHECK (
        status IN ('processing', 'completed', 'failed', 'pending_review')
    )
);

CREATE INDEX idx_cv_imports_portfolio_id ON cv_imports(portfolio_id);
CREATE INDEX idx_cv_imports_status ON cv_imports(status);
```

---

## 6. Database Design

### 6.1 Additional Tables for RAG

```sql
-- Document chunks metadata (actual vectors stored in vector DB)
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    chunk_type VARCHAR(50) NOT NULL,
    chunk_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    vector_id VARCHAR(255), -- ID in vector DB
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

-- Chat sessions
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    visitor_id VARCHAR(255), -- Anonymous visitor ID
    visitor_ip VARCHAR(45),
    visitor_location VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP,
    message_count INTEGER DEFAULT 0
);

CREATE INDEX idx_chat_sessions_portfolio_id ON chat_sessions(portfolio_id);
CREATE INDEX idx_chat_sessions_visitor_id ON chat_sessions(visitor_id);

-- Chat messages (extend existing messages table)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES chat_sessions(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS context_chunks JSONB; -- Retrieved chunks
ALTER TABLE messages ADD COLUMN IF NOT EXISTS response_time_ms INTEGER;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS tokens_used INTEGER;
```

### 6.2 Vector Database (Qdrant)

**Collection Configuration:**

```yaml
collection_name: portfolio_chunks
vector_size: 1536  # OpenAI embedding dimension
distance: Cosine
hnsw_config:
  m: 16
  ef_construct: 100
payload_schema:
  portfolio_id: keyword
  chunk_type: keyword
  chunk_id: keyword
  content: text
  metadata: json
```

---

## 7. API Design

### 7.1 RAG Service Endpoints

```yaml
# Initialize RAG for portfolio
POST /api/rag/portfolios/{portfolioId}/initialize
Response: 202 Accepted
Body: { "status": "processing" }

# Chat with AI
POST /api/rag/portfolios/{portfolioId}/chat
Request:
  {
    "question": "What are your skills?",
    "visitorId": "visitor_123",
    "sessionId": "session_456" // optional
  }
Response: 200 OK (streaming)
  {
    "response": "I have experience in...",
    "sessionId": "session_456",
    "contextUsed": [
      {
        "chunkId": "skill_category_123",
        "type": "skill_category",
        "relevance": 0.95
      }
    ]
  }

# Get chat history
GET /api/rag/portfolios/{portfolioId}/chat/history?sessionId={sessionId}
Response: 200 OK
  {
    "messages": [
      {
        "id": "msg_123",
        "question": "...",
        "response": "...",
        "createdAt": "2025-01-27T10:00:00Z"
      }
    ]
  }

# Rebuild RAG index (admin)
POST /api/rag/portfolios/{portfolioId}/rebuild
Response: 202 Accepted
```

### 7.2 CV Import Service Endpoints

```yaml
# Upload and import CV
POST /api/cv-import/portfolios/{portfolioId}/import
Request: multipart/form-data
  - file: PDF file
Response: 202 Accepted
  {
    "importId": "import_123",
    "status": "processing",
    "estimatedTime": 30 // seconds
  }

# Get import status
GET /api/cv-import/imports/{importId}
Response: 200 OK
  {
    "id": "import_123",
    "status": "completed",
    "extractedData": {
      "personalInfo": {...},
      "projects": [...],
      "skills": [...]
    },
    "confidence": 0.92
  }

# Review and confirm extracted data
POST /api/cv-import/imports/{importId}/confirm
Request:
  {
    "personalInfo": {...}, // user can edit
    "projects": [...],
    "skills": [...],
    "confirmAll": true
  }
Response: 200 OK
  {
    "status": "confirmed",
    "portfolioUpdated": true
  }

# Cancel import
DELETE /api/cv-import/imports/{importId}
Response: 200 OK
```

---

## 8. Technology Stack

### 8.1 Backend Services

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Spring Boot | 3.5.6 | Application framework |
| **Language** | Java | 21 | Programming language |
| **Build Tool** | Maven | 3.8+ | Dependency management |
| **Database** | PostgreSQL | 14+ | Primary database |
| **Vector DB** | Qdrant / PGVector | Latest | Vector storage |
| **Message Queue** | RabbitMQ | 3.12+ | Async processing |
| **File Storage** | MinIO / S3 | Latest | Object storage |
| **PDF Processing** | Apache PDFBox | 3.0+ | PDF text extraction |
| **LLM Client** | OpenAI Java SDK | Latest | AI API client |
| **Embedding** | OpenAI / Sentence Transformers | Latest | Vector embeddings |

### 8.2 Infrastructure

- **Service Discovery**: Consul
- **API Gateway**: Spring Cloud Gateway (AGW)
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Caching**: Redis (for session, rate limiting)

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Set up RAG Service project structure
- [ ] Set up CV Import Service project structure
- [ ] Configure PostgreSQL with new tables
- [ ] Set up Qdrant vector database
- [ ] Implement basic chunking service
- [ ] Implement embedding service (OpenAI)

### Phase 2: RAG Core (Week 3-4)
- [ ] Implement vector store service
- [ ] Implement retrieval service
- [ ] Implement LLM chat service
- [ ] Implement prompt builder
- [ ] Create RAG initialization endpoint
- [ ] Create chat endpoint (streaming)

### Phase 3: CV Import (Week 5-6)
- [ ] Implement PDF extraction service
- [ ] Implement text cleaning service
- [ ] Implement LLM-based CV parsing
- [ ] Implement data validation
- [ ] Implement portfolio population service
- [ ] Create CV import endpoints

### Phase 4: Integration (Week 7-8)
- [ ] Integrate RAG with Portfolio Service
- [ ] Integrate CV Import with Tools Service
- [ ] Set up async processing (RabbitMQ)
- [ ] Implement chunking triggers on data updates
- [ ] Add error handling and retry logic

### Phase 5: Optimization (Week 9-10)
- [ ] Implement caching for embeddings
- [ ] Optimize chunking strategy
- [ ] Add batch processing for embeddings
- [ ] Implement rate limiting
- [ ] Performance testing and tuning

### Phase 6: Production Ready (Week 11-12)
- [ ] Add monitoring and logging
- [ ] Implement health checks
- [ ] Add comprehensive error handling
- [ ] Write integration tests
- [ ] Documentation and deployment guides

---

## 10. Security Considerations

### 10.1 Data Security
- **Encryption at Rest**: Encrypt sensitive data in database
- **Encryption in Transit**: Use HTTPS/TLS for all API calls
- **Vector DB Security**: Secure Qdrant with authentication
- **File Storage**: Secure S3/MinIO buckets with IAM policies

### 10.2 API Security
- **Rate Limiting**: Limit requests per user/IP
- **Input Validation**: Validate all user inputs
- **SQL Injection Prevention**: Use parameterized queries
- **XSS Prevention**: Sanitize user-generated content

### 10.3 AI Security
- **Prompt Injection Prevention**: Sanitize user questions
- **Content Filtering**: Filter inappropriate content
- **Token Limits**: Limit tokens per request to prevent abuse
- **Cost Controls**: Monitor and limit API costs

### 10.4 Privacy
- **Data Minimization**: Only store necessary data
- **Anonymization**: Anonymize visitor data in analytics
- **GDPR Compliance**: Allow data deletion and export
- **Access Control**: Ensure users can only access their own data

---

## 11. Performance Considerations

### 11.1 RAG Performance
- **Caching**: Cache embeddings for unchanged chunks
- **Batch Processing**: Process multiple chunks in parallel
- **Async Processing**: Use async for non-blocking operations
- **Connection Pooling**: Pool database and API connections

### 11.2 CV Import Performance
- **Async Processing**: Process CVs asynchronously
- **Queue System**: Use message queue for long-running tasks
- **Progress Tracking**: Provide real-time progress updates
- **Retry Logic**: Retry failed operations with exponential backoff

### 11.3 Scalability
- **Horizontal Scaling**: Design services to scale horizontally
- **Load Balancing**: Use load balancer for service instances
- **Database Sharding**: Consider sharding for large datasets
- **CDN**: Use CDN for static assets

---

## 12. Monitoring & Observability

### 12.1 Metrics
- **API Latency**: Track response times for all endpoints
- **Error Rates**: Monitor error rates by service
- **AI API Costs**: Track token usage and costs
- **Vector DB Performance**: Monitor query performance
- **Queue Depth**: Monitor message queue depths

### 12.2 Logging
- **Structured Logging**: Use structured logs (JSON)
- **Log Levels**: Appropriate log levels (DEBUG, INFO, WARN, ERROR)
- **Correlation IDs**: Use correlation IDs for request tracking
- **Sensitive Data**: Never log sensitive data (passwords, tokens)

### 12.3 Alerts
- **Error Rate Thresholds**: Alert on high error rates
- **Latency Thresholds**: Alert on slow responses
- **Queue Backlog**: Alert on queue backlog
- **API Quota**: Alert on API quota limits

---

## 13. Testing Strategy

### 13.1 Unit Tests
- Test individual service methods
- Mock external dependencies (LLM APIs, Vector DB)
- Test edge cases and error handling

### 13.2 Integration Tests
- Test service-to-service communication
- Test database operations
- Test vector DB operations
- Test end-to-end workflows

### 13.3 E2E Tests
- Test complete user flows
- Test CV import → RAG initialization → Chat flow
- Test error scenarios

---

## 14. Deployment

### 14.1 Containerization
- Docker containers for all services
- Docker Compose for local development
- Kubernetes for production

### 14.2 CI/CD
- GitHub Actions / GitLab CI
- Automated testing
- Automated deployment to staging/production

### 14.3 Environment Variables
```bash
# RAG Service
RAG_OPENAI_API_KEY=sk-...
RAG_EMBEDDING_MODEL=text-embedding-3-small
RAG_LLM_MODEL=gpt-4-turbo-preview
RAG_VECTOR_DB_URL=http://qdrant:6333
RAG_CHUNK_SIZE=500
RAG_CHUNK_OVERLAP=50

# CV Import Service
CV_IMPORT_OPENAI_API_KEY=sk-...
CV_IMPORT_LLM_MODEL=gpt-4-turbo-preview
CV_IMPORT_MAX_FILE_SIZE=10485760 # 10MB
CV_IMPORT_ALLOWED_TYPES=application/pdf

# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/profolio
DATABASE_USERNAME=profolio
DATABASE_PASSWORD=...

# Message Queue
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE_CV_IMPORT=cv-import-queue
RABBITMQ_QUEUE_EMBEDDING=embedding-queue
```

---

## 15. Next Steps

1. **Review and Approve**: Review this architecture document with team
2. **Create Projects**: Set up Spring Boot projects for RAG and CV Import services
3. **Database Migration**: Create Flyway migrations for new tables
4. **Prototype**: Build minimal viable prototypes for validation
5. **Iterate**: Refine based on prototype results

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Author**: Senior Backend Engineer  
**Status**: Draft for Review
