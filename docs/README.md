# Profolio Backend Development Documentation

## 📚 Documentation Index

Đây là bộ tài liệu hoàn chỉnh cho việc phát triển backend của Profolio AI, được thiết kế bởi Senior Backend Engineer.

### 🎯 Mục đích

Tài liệu này cung cấp:
- **Kiến trúc hệ thống** hoàn chỉnh
- **Implementation guides** chi tiết cho từng service
- **API specifications** đầy đủ
- **Database design** và migrations
- **Best practices** và patterns

---

## 📖 Tài liệu chính

### 1. [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md)
**Tổng quan kiến trúc hệ thống**

Bao gồm:
- System overview và business requirements
- Architecture diagram (microservices, databases, external services)
- Service architecture (8 microservices)
- **RAG Service Design** - Thiết kế chi tiết RAG pipeline
- **CV Import Service Design** - Thiết kế CV parsing và auto-population
- Database design
- Technology stack
- Implementation roadmap (12 tuần)
- Security và performance considerations

**Đọc đầu tiên:** Bắt đầu từ document này để hiểu tổng quan hệ thống.

---

### 2. [RAG_SERVICE_IMPLEMENTATION.md](./RAG_SERVICE_IMPLEMENTATION.md)
**Hướng dẫn implementation RAG Service**

Bao gồm:
- Project setup (Maven, dependencies)
- Database schema (Flyway migrations)
- Core components (Entities, Services, Repositories)
- Implementation details:
  - ChunkingService - Chia nhỏ portfolio data
  - EmbeddingService - Generate embeddings với OpenAI
  - VectorStoreService - Lưu trữ và tìm kiếm vectors
  - LLMService - Chat completion với context
- API endpoints
- Testing strategies
- Deployment (Docker)

**Khi nào đọc:** Khi bắt đầu implement RAG Service.

---

### 3. [CV_IMPORT_SERVICE_IMPLEMENTATION.md](./CV_IMPORT_SERVICE_IMPLEMENTATION.md)
**Hướng dẫn implementation CV Import Service**

Bao gồm:
- Project setup
- Database schema
- Core components:
  - PDFExtractionService - Extract text từ PDF
  - CVParsingService - Parse CV với LLM
  - PortfolioPopulationService - Auto-populate portfolio data
- Implementation details
- API endpoints
- Testing và deployment

**Khi nào đọc:** Khi bắt đầu implement CV Import Service.

---

### 4. [API_SPECIFICATIONS.md](./API_SPECIFICATIONS.md)
**API Specifications đầy đủ**

Bao gồm:
- Authentication
- RAG Service APIs (5 endpoints)
- CV Import Service APIs (4 endpoints)
- Error handling
- Rate limiting
- Request/Response examples

**Khi nào đọc:** Khi implement API endpoints hoặc integrate với frontend.

---

## 🚀 Quick Start Guide

### Bước 1: Đọc Architecture
```bash
# Đọc để hiểu tổng quan
docs/BACKEND_ARCHITECTURE.md
```

### Bước 2: Setup Infrastructure
```bash
# 1. PostgreSQL
docker run -d --name postgres -e POSTGRES_PASSWORD=profolio -p 5432:5432 postgres:14

# 2. Qdrant (Vector DB)
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant:latest

# 3. RabbitMQ (Message Queue)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# 4. MinIO (File Storage)
docker run -d --name minio -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

### Bước 3: Tạo Services

**RAG Service:**
```bash
cd profolio-be
# Follow: docs/RAG_SERVICE_IMPLEMENTATION.md
```

**CV Import Service:**
```bash
cd profolio-be
# Follow: docs/CV_IMPORT_SERVICE_IMPLEMENTATION.md
```

### Bước 4: Implement theo Roadmap

Xem **Implementation Roadmap** trong `BACKEND_ARCHITECTURE.md` (Section 9).

---

## 🏗️ Kiến trúc tổng quan

```
Frontend (React)
    ↓
API Gateway (AGW :8080)
    ↓
┌─────────────┬──────────────┬──────────────┬──────────────┐
│  Portfolio  │   Content    │    Tools     │     RAG      │
│  Service    │   Service    │   Service    │   Service    │
│   :8081     │    :8082     │    :8083     │    :8084     │
└─────────────┴──────────────┴──────────────┴──────────────┘
    ↓
PostgreSQL + Qdrant (Vector DB) + RabbitMQ + MinIO
```

---

## 📋 Implementation Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Set up RAG Service project
- [ ] Set up CV Import Service project
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

## 🔧 Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Spring Boot | 3.5.6 |
| Language | Java | 21 |
| Database | PostgreSQL | 14+ |
| Vector DB | Qdrant | Latest |
| Message Queue | RabbitMQ | 3.12+ |
| File Storage | MinIO / S3 | Latest |
| PDF Processing | Apache PDFBox | 3.0+ |
| LLM Client | OpenAI Java SDK | Latest |

---

## 📝 Coding Standards

### Java Code Style
- Follow Google Java Style Guide
- Use Lombok for boilerplate code
- Use Builder pattern for complex objects
- Use CompletableFuture for async operations

### API Design
- RESTful conventions
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Consistent error responses
- Version APIs if needed

### Database
- Use Flyway for migrations
- Use JPA/Hibernate for ORM
- Use UUID for primary keys
- Add indexes for frequently queried columns

---

## 🧪 Testing

### Unit Tests
- Test individual service methods
- Mock external dependencies
- Test edge cases

### Integration Tests
- Test service-to-service communication
- Test database operations
- Test vector DB operations

### E2E Tests
- Test complete user flows
- Test CV import → RAG initialization → Chat flow

---

## 🚨 Common Issues & Solutions

### Issue: Vector DB Connection Failed
**Solution:** Check Qdrant is running and URL is correct in `application.yml`

### Issue: OpenAI API Rate Limit
**Solution:** Implement retry logic with exponential backoff, use batch processing

### Issue: PDF Extraction Fails
**Solution:** Check PDF is not corrupted, handle different PDF formats

### Issue: Chunking Too Slow
**Solution:** Use async processing, batch embeddings, cache results

---

## 📞 Support

Nếu có câu hỏi về implementation:
1. Đọc lại relevant documentation
2. Check code examples trong implementation guides
3. Review architecture decisions trong BACKEND_ARCHITECTURE.md

---

## 📅 Document Versions

| Document | Version | Last Updated |
|----------|---------|--------------|
| BACKEND_ARCHITECTURE.md | 1.0 | 2025-01-27 |
| RAG_SERVICE_IMPLEMENTATION.md | 1.0 | 2025-01-27 |
| CV_IMPORT_SERVICE_IMPLEMENTATION.md | 1.0 | 2025-01-27 |
| API_SPECIFICATIONS.md | 1.0 | 2025-01-27 |

---

**Happy Coding! 🚀**
