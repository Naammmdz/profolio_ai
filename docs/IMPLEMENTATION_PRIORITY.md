# Implementation Priority Guide

## 🎯 Service Priority Analysis

Dựa trên UI hiện tại và dependencies, đây là thứ tự ưu tiên implement các services:

---

## 📊 Priority Matrix

| Service | Priority | Reason | Dependencies | UI Impact |
|---------|----------|--------|--------------|-----------|
| **Portfolio Service** | 🔴 **CRITICAL** | Foundation cho tất cả services khác | None | Dashboard, Publish tabs |
| **Content Service** | 🟠 **HIGH** | Core content (Projects, Skills, Questions) | Portfolio Service | Tools, Questions tabs |
| **Tools Service** | 🟡 **MEDIUM** | Personal Info, Contact, etc. | Portfolio Service | Tools tab |
| **RAG Service** | 🟢 **MEDIUM** | AI chat functionality | Portfolio, Content, Tools Services | Portfolio Preview (chat) |
| **CV Import Service** | 🔵 **LOW** | Nice-to-have feature | Portfolio, Content, Tools Services | Tools tab (import button) |
| **File Service** | 🟡 **MEDIUM** | File uploads (avatar, images, resume) | None | Basic Info, Tools tabs |
| **Analytics Service** | 🔵 **LOW** | Analytics tracking | Portfolio Service | Analytics, Dashboard tabs |

---

## 🚀 Recommended Implementation Order

### Phase 1: Foundation (Week 1-2) - **START HERE**

#### 1.1 Portfolio Service (🔴 CRITICAL - Do First)

**Why:**
- Tất cả services khác đều cần Portfolio ID
- Dashboard tab cần: portfolio stats, publish status
- Publish tab cần: publish/unpublish functionality
- Basic Info tab cần: portfolio settings

**Endpoints cần implement ngay:**
```
GET    /api/portfolios/me              - Lấy portfolio của user
POST   /api/portfolios                 - Tạo portfolio mới (nếu chưa có)
PUT    /api/portfolios/{id}            - Cập nhật portfolio
GET    /api/portfolios/{id}/settings   - Lấy settings
PUT    /api/portfolios/{id}/settings   - Cập nhật settings
POST   /api/portfolios/{id}/publish    - Publish portfolio
POST   /api/portfolios/{id}/unpublish  - Unpublish portfolio
GET    /api/portfolios/{id}/stats      - Lấy stats (messages used, messages today)
```

**UI Impact:**
- ✅ Dashboard tab: Hiển thị portfolio stats
- ✅ Publish tab: Publish/unpublish buttons hoạt động
- ✅ Basic Info tab: Lưu settings
- ✅ Header: Draft Mode status

**Estimated Time:** 3-4 days

---

#### 1.2 File Service (🟡 MEDIUM - Do Second)

**Why:**
- Cần cho avatar upload (Basic Info tab)
- Cần cho image uploads (Projects, Hobbies)
- Cần cho resume upload (Tools tab)
- Độc lập, không depend on services khác

**Endpoints:**
```
POST   /api/upload/avatar              - Upload avatar
POST   /api/upload/image               - Upload image
POST   /api/upload/resume              - Upload resume
GET    /api/files/{fileId}             - Download file
DELETE /api/files/{fileId}             - Delete file
```

**UI Impact:**
- ✅ Basic Info tab: Avatar upload
- ✅ Tools tab: Image uploads, resume upload

**Estimated Time:** 2-3 days

---

### Phase 2: Core Content (Week 3-4)

#### 2.1 Content Service (🟠 HIGH - Do Third)

**Why:**
- Tools tab cần Projects và Skills
- Questions tab cần Suggested Questions
- Đây là core content của portfolio

**Endpoints:**
```
# Projects
GET    /api/portfolios/{id}/projects          - Lấy tất cả projects
POST   /api/portfolios/{id}/projects         - Tạo project mới
PUT    /api/projects/{projectId}              - Cập nhật project
DELETE /api/projects/{projectId}              - Xóa project

# Skills
GET    /api/portfolios/{id}/skill-categories  - Lấy skill categories
POST   /api/portfolios/{id}/skill-categories  - Tạo skill category
PUT    /api/skill-categories/{id}             - Cập nhật skill category
DELETE /api/skill-categories/{id}             - Xóa skill category

# Questions
GET    /api/portfolios/{id}/questions         - Lấy questions
POST   /api/portfolios/{id}/questions         - Tạo question
PUT    /api/questions/{id}                    - Cập nhật question
DELETE /api/questions/{id}                    - Xóa question
```

**UI Impact:**
- ✅ Tools tab: Projects và Skills sections hoạt động
- ✅ Questions tab: Quản lý questions

**Estimated Time:** 5-6 days

---

#### 2.2 Tools Service (🟡 MEDIUM - Do Fourth)

**Why:**
- Tools tab cần Personal Info, Contact, Resume, etc.
- Có thể làm sau Content Service vì ít phức tạp hơn

**Endpoints:**
```
# Personal Info
GET    /api/portfolios/{id}/personal-info     - Lấy personal info
PUT    /api/portfolios/{id}/personal-info     - Cập nhật personal info

# Contact
GET    /api/portfolios/{id}/contact           - Lấy contact info
PUT    /api/portfolios/{id}/contact           - Cập nhật contact info
POST   /api/portfolios/{id}/contact/social-links - Thêm social link
DELETE /api/social-links/{id}                 - Xóa social link

# Resume
GET    /api/portfolios/{id}/resume            - Lấy resume
PUT    /api/portfolios/{id}/resume           - Cập nhật resume

# Video
GET    /api/portfolios/{id}/video             - Lấy video
PUT    /api/portfolios/{id}/video             - Cập nhật video

# Location
GET    /api/portfolios/{id}/location          - Lấy location
PUT    /api/portfolios/{id}/location         - Cập nhật location

# Hobbies
GET    /api/portfolios/{id}/hobbies           - Lấy hobbies
PUT    /api/portfolios/{id}/hobbies           - Cập nhật hobbies

# Tools Config
GET    /api/portfolios/{id}/tools-config     - Lấy tools config
PUT    /api/portfolios/{id}/tools-config     - Cập nhật tools config
```

**UI Impact:**
- ✅ Tools tab: Tất cả tool cards hoạt động

**Estimated Time:** 4-5 days

---

### Phase 3: AI Features (Week 5-8)

#### 3.1 RAG Service (🟢 MEDIUM - Do Fifth)

**Why:**
- Cần có data trước (từ Portfolio, Content, Tools)
- Phức tạp, cần infrastructure (Qdrant)
- Cần cho AI chat trong Portfolio Preview

**Prerequisites:**
- ✅ Portfolio Service (có data)
- ✅ Content Service (có projects, skills)
- ✅ Tools Service (có personal info)
- ✅ Qdrant vector DB setup
- ✅ OpenAI API key

**Endpoints:**
```
POST   /api/rag/portfolios/{id}/initialize   - Initialize RAG
POST   /api/rag/portfolios/{id}/chat         - Chat with AI
GET    /api/rag/portfolios/{id}/status       - Get status
```

**UI Impact:**
- ✅ Portfolio Preview: Chat interface hoạt động

**Estimated Time:** 8-10 days

---

#### 3.2 CV Import Service (🔵 LOW - Do Sixth)

**Why:**
- Nice-to-have feature
- Phụ thuộc vào các services khác
- Có thể làm sau khi core features hoàn thành

**Prerequisites:**
- ✅ Portfolio Service
- ✅ Content Service
- ✅ Tools Service
- ✅ File Service

**Endpoints:**
```
POST   /api/cv-import/portfolios/{id}/import - Import CV
GET    /api/cv-import/imports/{id}          - Get status
POST   /api/cv-import/imports/{id}/confirm   - Confirm import
```

**UI Impact:**
- ✅ Tools tab: CV import button

**Estimated Time:** 5-6 days

---

## 🎯 **RECOMMENDATION: Start với Portfolio Service**

### Lý do:

1. **Foundation**: Tất cả services khác đều cần Portfolio ID
2. **Quick Win**: Tương đối đơn giản, có thể làm nhanh
3. **UI Impact**: Dashboard và Publish tabs sẽ hoạt động ngay
4. **No Dependencies**: Không cần services khác

### Implementation Plan cho Portfolio Service:

**Day 1-2: Setup & Database**
- [ ] Tạo Spring Boot project
- [ ] Setup PostgreSQL connection
- [ ] Create Flyway migrations (portfolios, portfolio_settings tables)
- [ ] Create Entity classes

**Day 3: Core CRUD**
- [ ] Implement PortfolioRepository
- [ ] Implement PortfolioService
- [ ] Implement PortfolioController
- [ ] Test CRUD operations

**Day 4: Settings & Publish**
- [ ] Implement PortfolioSettingsService
- [ ] Implement publish/unpublish logic
- [ ] Implement stats endpoint
- [ ] Integration tests

**Day 5: Integration & Testing**
- [ ] Integrate với AGW
- [ ] Test với Frontend
- [ ] Fix bugs
- [ ] Documentation

---

## 📋 Quick Start Checklist

### Before Starting:
- [ ] Review `BACKEND_ARCHITECTURE.md`
- [ ] Review `API_SPECIFICATIONS.md`
- [ ] Setup PostgreSQL
- [ ] Setup development environment

### Week 1-2: Foundation
- [ ] ✅ **Portfolio Service** (Priority 1)
- [ ] ✅ **File Service** (Priority 2)

### Week 3-4: Core Content
- [ ] ✅ **Content Service** (Priority 3)
- [ ] ✅ **Tools Service** (Priority 4)

### Week 5-8: AI Features
- [ ] ✅ **RAG Service** (Priority 5)
- [ ] ✅ **CV Import Service** (Priority 6)

---

## 💡 Tips

1. **Start Small**: Implement basic CRUD trước, optimize sau
2. **Test Early**: Write tests ngay từ đầu
3. **Document**: Document APIs và decisions
4. **Iterate**: Get feedback từ frontend team sớm

---

## 🚨 Common Pitfalls to Avoid

1. **Don't skip Portfolio Service**: Nó là foundation
2. **Don't implement RAG too early**: Cần data trước
3. **Don't forget File Service**: UI cần upload functionality
4. **Don't over-engineer**: Start simple, refactor later

---

**Next Step:** Bắt đầu với **Portfolio Service** theo implementation guide trong `RAG_SERVICE_IMPLEMENTATION.md` (adapt cho Portfolio Service).

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27
