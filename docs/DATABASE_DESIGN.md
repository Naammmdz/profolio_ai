# Database Design Document

## Tổng quan

Tài liệu này mô tả kiến trúc database cho ứng dụng Profolio - AI Portfolio Platform. Database được thiết kế dựa trên phân tích frontend components và các entities được sử dụng trong ứng dụng.

## Entity Relationship Diagram (Conceptual)

```
User (1) ──────< (1) Portfolio ──────< (N) Project
                         │
                         ├───< (N) SkillCategory ────< (N) Skill
                         ├───< (N) Question
                         ├───< (N) Message/Conversation
                         ├───< (1) PortfolioSettings
                         ├───< (1) AIPersonality
                         ├───< (1) Contact
                         ├───< (1) Location
                         ├───< (1) Resume
                         ├───< (1) Video
                         └───< (1) Hobby

Project ────< (N) ProjectLink
      └───< (N) ProjectImage
      └───< (N) ProjectTag

Contact ────< (N) SocialLink
```

## Core Entities

### 1. **users**
Core user entity - người dùng đăng ký và sở hữu portfolio.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    name VARCHAR(255),
    avatar_url TEXT,
    provider VARCHAR(50), -- 'google', 'github', 'email'
    provider_id VARCHAR(255), -- External provider user ID
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_provider ON users(provider, provider_id);
```

### 2. **portfolios**
Portfolio chính - mỗi user có 1 portfolio.

```sql
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL, -- profol.io/{slug}
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published'
    headline VARCHAR(255), -- Portfolio headline (optional)
    welcome_tagline VARCHAR(255), -- "Backend Developer"
    chat_placeholder VARCHAR(255) DEFAULT 'Ask me anything...',
    custom_domain VARCHAR(255), -- Custom domain (Pro feature)
    show_profolio_badge BOOLEAN DEFAULT true, -- Required for free plan
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT portfolios_status_check CHECK (status IN ('draft', 'published'))
);

CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_portfolios_status ON portfolios(status);
CREATE UNIQUE INDEX idx_portfolios_user_unique ON portfolios(user_id) WHERE status = 'published';
```

### 3. **portfolio_settings**
Cài đặt giao diện và hiển thị của portfolio.

```sql
CREATE TABLE portfolio_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'default', -- 'default', 'dark', 'playful'
    cursor_animation VARCHAR(50) DEFAULT 'fluid', -- 'fluid', 'solid', 'none'
    avatar_shape VARCHAR(20) DEFAULT 'squared', -- 'squared', 'rounded'
    avatar_enabled BOOLEAN DEFAULT true,
    welcome_modal_enabled BOOLEAN DEFAULT true,
    welcome_modal_title VARCHAR(255) DEFAULT 'Welcome to AI Portfolio',
    welcome_modal_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT portfolio_settings_portfolio_unique UNIQUE (portfolio_id)
);

CREATE INDEX idx_portfolio_settings_portfolio_id ON portfolio_settings(portfolio_id);
```

### 4. **ai_personalities**
Cấu hình AI personality - cách AI giao tiếp.

```sql
CREATE TABLE ai_personalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    communication_vibe INTEGER DEFAULT 50, -- 0-100 slider (Formal to Energetic)
    professional_what_you_do TEXT,
    professional_superpower_skills TEXT,
    professional_biggest_flex TEXT,
    personal_what_drives_you TEXT,
    personal_outside_work TEXT,
    personal_unique_thing TEXT,
    communication_style TEXT,
    communication_topics TEXT,
    personal_touch TEXT, -- Long text field for personal details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ai_personalities_portfolio_unique UNIQUE (portfolio_id),
    CONSTRAINT ai_personalities_vibe_check CHECK (communication_vibe >= 0 AND communication_vibe <= 100)
);

CREATE INDEX idx_ai_personalities_portfolio_id ON ai_personalities(portfolio_id);
```

### 5. **projects**
Dự án trong portfolio.

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- 'WebApp', 'Mobile App', etc.
    description TEXT,
    project_date VARCHAR(100), -- 'November 2025', 'November 1st, 2025'
    preview_image_url TEXT,
    display_order INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX idx_projects_enabled ON projects(enabled);
CREATE INDEX idx_projects_display_order ON projects(display_order);
```

### 6. **project_tags**
Tags/tech stack của project.

```sql
CREATE TABLE project_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT project_tags_unique UNIQUE (project_id, tag_name)
);

CREATE INDEX idx_project_tags_project_id ON project_tags(project_id);
```

### 7. **project_links**
Links của project (GitHub, Demo, etc.).

```sql
CREATE TABLE project_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    link_name VARCHAR(100) NOT NULL, -- 'GitHub', 'Demo', etc.
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_links_project_id ON project_links(project_id);
```

### 8. **project_images**
Images của project (max 5 images).

```sql
CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_images_order ON project_images(project_id, image_order);
```

### 9. **skill_categories**
Danh mục skills (Languages, Frameworks, Databases, etc.).

```sql
CREATE TABLE skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL, -- 'Languages', 'Frameworks', etc.
    enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skill_categories_portfolio_id ON skill_categories(portfolio_id);
CREATE INDEX idx_skill_categories_enabled ON skill_categories(enabled);
```

### 10. **skills**
Skills trong từng category.

```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT skills_unique UNIQUE (skill_category_id, skill_name)
);

CREATE INDEX idx_skills_category_id ON skills(skill_category_id);
```

### 11. **suggested_questions**
Suggested questions cho visitors.

```sql
CREATE TABLE suggested_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'About Me', 'Professional', 'Projects', etc.
    is_default BOOLEAN DEFAULT false, -- System default questions
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_suggested_questions_portfolio_id ON suggested_questions(portfolio_id);
CREATE INDEX idx_suggested_questions_category ON suggested_questions(category);
```

### 12. **tools_config**
Cấu hình tools (enable/disable các tools).

```sql
CREATE TABLE tools_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    tool_name VARCHAR(50) NOT NULL, -- 'personal', 'projects', 'skills', 'hobbies', 'contact', 'resume', 'video', 'location'
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT tools_config_unique UNIQUE (portfolio_id, tool_name),
    CONSTRAINT tools_config_name_check CHECK (tool_name IN ('personal', 'projects', 'skills', 'hobbies', 'contact', 'resume', 'video', 'location'))
);

CREATE INDEX idx_tools_config_portfolio_id ON tools_config(portfolio_id);
```

### 13. **personal_info**
Thông tin cá nhân (Me tool).

```sql
CREATE TABLE personal_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    location TEXT,
    introduction TEXT,
    presentation_photo_url TEXT,
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT personal_info_portfolio_unique UNIQUE (portfolio_id)
);

CREATE INDEX idx_personal_info_portfolio_id ON personal_info(portfolio_id);
CREATE INDEX idx_personal_info_tags ON personal_info USING GIN(tags);
```

### 14. **contact_info**
Thông tin liên hệ.

```sql
CREATE TABLE contact_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    handle_username VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT contact_info_portfolio_unique UNIQUE (portfolio_id)
);

CREATE INDEX idx_contact_info_portfolio_id ON contact_info(portfolio_id);
```

### 15. **social_links**
Social media links.

```sql
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_info_id UUID NOT NULL REFERENCES contact_info(id) ON DELETE CASCADE,
    platform_name VARCHAR(100) NOT NULL, -- 'GitHub', 'LinkedIn', 'Twitter', etc.
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_social_links_contact_id ON social_links(contact_info_id);
```

### 16. **resumes**
Resume/CV files.

```sql
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT, -- Size in bytes
    file_type VARCHAR(50) DEFAULT 'application/pdf',
    title VARCHAR(255),
    description TEXT,
    last_updated TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT resumes_portfolio_unique UNIQUE (portfolio_id)
);

CREATE INDEX idx_resumes_portfolio_id ON resumes(portfolio_id);
```

### 17. **videos**
Video content.

```sql
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT videos_portfolio_unique UNIQUE (portfolio_id)
);

CREATE INDEX idx_videos_portfolio_id ON videos(portfolio_id);
```

### 18. **locations**
Location information.

```sql
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    city VARCHAR(255),
    country VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT locations_portfolio_unique UNIQUE (portfolio_id)
);

CREATE INDEX idx_locations_portfolio_id ON locations(portfolio_id);
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);
```

### 19. **hobbies**
Fun & Hobbies section.

```sql
CREATE TABLE hobbies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT hobbies_portfolio_unique UNIQUE (portfolio_id)
);

CREATE INDEX idx_hobbies_portfolio_id ON hobbies(portfolio_id);
```

### 20. **hobby_images**
Images cho hobbies section (max 3 images).

```sql
CREATE TABLE hobby_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hobby_id UUID NOT NULL REFERENCES hobbies(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hobby_images_hobby_id ON hobby_images(hobby_id);
CREATE INDEX idx_hobby_images_order ON hobby_images(hobby_id, image_order);
```

### 21. **messages**
Messages từ visitors (conversation history).

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    visitor_ip VARCHAR(45), -- IPv6 support
    visitor_location VARCHAR(255),
    question TEXT NOT NULL,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT messages_question_check CHECK (LENGTH(question) > 0)
);

CREATE INDEX idx_messages_portfolio_id ON messages(portfolio_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_visitor_ip ON messages(visitor_ip);
```

### 22. **analytics**
Analytics data (cho future analytics tab).

```sql
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'page_view', 'message_sent', 'project_viewed', etc.
    event_data JSONB,
    visitor_ip VARCHAR(45),
    visitor_location VARCHAR(255),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_portfolio_id ON analytics(portfolio_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX idx_analytics_event_data ON analytics USING GIN(event_data);
```

### 23. **subscriptions** (Optional - for Pro features)
Subscription/plan information.

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) DEFAULT 'free', -- 'free', 'pro'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    monthly_message_limit INTEGER DEFAULT 50, -- Free: 50, Pro: unlimited or higher
    messages_used INTEGER DEFAULT 0,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT subscriptions_user_unique UNIQUE (user_id),
    CONSTRAINT subscriptions_plan_check CHECK (plan_type IN ('free', 'pro')),
    CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'cancelled', 'expired'))
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

## Relationships Summary

### One-to-One Relationships:
- User → Portfolio (1:1)
- Portfolio → PortfolioSettings (1:1)
- Portfolio → AIPersonality (1:1)
- Portfolio → PersonalInfo (1:1)
- Portfolio → ContactInfo (1:1)
- Portfolio → Resume (1:1)
- Portfolio → Video (1:1)
- Portfolio → Location (1:1)
- Portfolio → Hobby (1:1)
- User → Subscription (1:1)

### One-to-Many Relationships:
- Portfolio → Projects (1:N)
- Portfolio → SkillCategories (1:N)
- Portfolio → SuggestedQuestions (1:N)
- Portfolio → ToolsConfig (1:N)
- Portfolio → Messages (1:N)
- Portfolio → Analytics (1:N)
- Project → ProjectTags (1:N)
- Project → ProjectLinks (1:N)
- Project → ProjectImages (1:N)
- SkillCategory → Skills (1:N)
- ContactInfo → SocialLinks (1:N)
- Hobby → HobbyImages (1:N)

## Indexes Strategy

### Primary Indexes:
- All primary keys (UUID)
- Foreign keys (for joins)

### Performance Indexes:
- `portfolios.slug` - For public portfolio lookup
- `portfolios.status` - Filter published/draft
- `messages.created_at` - For recent messages
- `analytics.created_at` - For time-based queries
- Array indexes for tags (GIN indexes)

### Composite Indexes:
- `(portfolio_id, display_order)` - For ordered listings
- `(portfolio_id, enabled)` - For filtering enabled items

## Constraints & Validation

### Check Constraints:
- Portfolio status: 'draft' | 'published'
- Communication vibe: 0-100
- Tool names: predefined list
- Subscription plans: 'free' | 'pro'

### Unique Constraints:
- User email
- Username
- Portfolio slug
- One active portfolio per user
- One setting/personality per portfolio

## Data Types Recommendations

- **UUID**: Primary keys (better for distributed systems)
- **TEXT**: Long text fields (descriptions, content)
- **VARCHAR**: Short strings with length limits
- **JSONB**: Flexible data (analytics event_data)
- **ARRAY**: For tags (PostgreSQL native)
- **TIMESTAMP**: All date/time fields
- **BOOLEAN**: Flags and toggles
- **INTEGER**: Counters, orders, limits
- **DECIMAL**: Coordinates (latitude/longitude)

## Database Features to Consider

1. **Full-Text Search**: For searching questions, projects, skills
2. **JSONB Support**: For flexible analytics data
3. **Array Support**: For tags
4. **Soft Deletes**: Consider adding `deleted_at` timestamp
5. **Audit Trail**: Consider adding `created_by`, `updated_by`
6. **File Storage**: URLs stored, actual files in S3/Cloud Storage

## Migration Strategy

### Phase 1: Core Tables
1. users
2. portfolios
3. portfolio_settings
4. ai_personalities

### Phase 2: Content Tables
5. projects + project_tags, project_links, project_images
6. skill_categories + skills
7. suggested_questions

### Phase 3: Tools Tables
8. tools_config
9. personal_info
10. contact_info + social_links
11. resumes
12. videos
13. locations
14. hobbies + hobby_images

### Phase 4: Analytics & Features
15. messages
16. analytics
17. subscriptions

## API Endpoints Mapping

Dựa trên frontend, backend cần cung cấp:

### Authentication
- `POST /api/auth/login` - Google/GitHub OAuth
- `POST /api/auth/register` - New user
- `POST /api/auth/logout`
- `GET /api/auth/me` - Current user

### Portfolio
- `GET /api/portfolios/:slug` - Public portfolio
- `GET /api/portfolios/me` - Own portfolio
- `PUT /api/portfolios/me` - Update portfolio
- `POST /api/portfolios/me/publish` - Publish
- `POST /api/portfolios/me/unpublish` - Unpublish

### Projects
- `GET /api/portfolios/me/projects`
- `POST /api/portfolios/me/projects`
- `PUT /api/portfolios/me/projects/:id`
- `DELETE /api/portfolios/me/projects/:id`

### Skills
- `GET /api/portfolios/me/skills`
- `POST /api/portfolios/me/skill-categories`
- `PUT /api/portfolios/me/skill-categories/:id`
- `DELETE /api/portfolios/me/skill-categories/:id`

### Questions
- `GET /api/portfolios/me/questions`
- `POST /api/portfolios/me/questions`
- `PUT /api/portfolios/me/questions/:id`
- `DELETE /api/portfolios/me/questions/:id`

### Settings
- `GET /api/portfolios/me/settings`
- `PUT /api/portfolios/me/settings`
- `GET /api/portfolios/me/ai-personality`
- `PUT /api/portfolios/me/ai-personality`

### Tools
- `GET /api/portfolios/me/tools`
- `PUT /api/portfolios/me/tools/:name` - Enable/disable tool
- Various tool-specific endpoints

### Analytics
- `GET /api/portfolios/me/analytics`
- `GET /api/portfolios/me/messages`

## Security Considerations

1. **Authentication**: JWT tokens, OAuth providers
2. **Authorization**: Users can only modify their own portfolio
3. **Rate Limiting**: Message limits based on subscription
4. **Input Validation**: Sanitize all user inputs
5. **File Upload**: Validate file types and sizes
6. **SQL Injection**: Use parameterized queries
7. **XSS Prevention**: Sanitize text outputs

## Performance Considerations

1. **Caching**: Cache public portfolios, popular content
2. **Lazy Loading**: Load related entities on demand
3. **Pagination**: For messages, analytics, projects
4. **CDN**: For static assets (images, files)
5. **Database Pooling**: Connection pooling
6. **Read Replicas**: For analytics queries

## Future Enhancements

1. **Multi-language Support**: i18n fields
2. **Versioning**: Portfolio version history
3. **Collaboration**: Share portfolio editing
4. **Templates**: Pre-built portfolio templates
5. **AI Training**: Store conversation patterns
6. **Export**: Export portfolio data

