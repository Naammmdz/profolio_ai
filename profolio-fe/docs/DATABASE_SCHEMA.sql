-- Profolio Database Schema
-- PostgreSQL Database Schema
-- Generated from frontend analysis

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================
-- CORE TABLES
-- ============================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    name VARCHAR(255),
    avatar_url TEXT,
    provider VARCHAR(50) NOT NULL DEFAULT 'email', -- 'google', 'github', 'email'
    provider_id VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT users_provider_check CHECK (provider IN ('google', 'github', 'email'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username) WHERE username IS NOT NULL;
CREATE INDEX idx_users_provider ON users(provider, provider_id) WHERE provider_id IS NOT NULL;

-- Portfolios table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' NOT NULL,
    headline VARCHAR(255),
    welcome_tagline VARCHAR(255),
    chat_placeholder VARCHAR(255) DEFAULT 'Ask me anything...',
    custom_domain VARCHAR(255),
    show_profolio_badge BOOLEAN DEFAULT true,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT portfolios_status_check CHECK (status IN ('draft', 'published'))
);

CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_portfolios_status ON portfolios(status);
CREATE UNIQUE INDEX idx_portfolios_user_published ON portfolios(user_id) WHERE status = 'published';

-- Portfolio Settings
CREATE TABLE portfolio_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'default',
    cursor_animation VARCHAR(50) DEFAULT 'fluid',
    avatar_shape VARCHAR(20) DEFAULT 'squared',
    avatar_enabled BOOLEAN DEFAULT true,
    welcome_modal_enabled BOOLEAN DEFAULT true,
    welcome_modal_title VARCHAR(255) DEFAULT 'Welcome to AI Portfolio',
    welcome_modal_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT portfolio_settings_portfolio_unique UNIQUE (portfolio_id),
    CONSTRAINT portfolio_settings_theme_check CHECK (theme IN ('default', 'dark', 'playful')),
    CONSTRAINT portfolio_settings_cursor_check CHECK (cursor_animation IN ('fluid', 'solid', 'none')),
    CONSTRAINT portfolio_settings_avatar_shape_check CHECK (avatar_shape IN ('squared', 'rounded'))
);

CREATE INDEX idx_portfolio_settings_portfolio_id ON portfolio_settings(portfolio_id);

-- AI Personalities
CREATE TABLE ai_personalities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    communication_vibe INTEGER DEFAULT 50,
    professional_what_you_do TEXT,
    professional_superpower_skills TEXT,
    professional_biggest_flex TEXT,
    personal_what_drives_you TEXT,
    personal_outside_work TEXT,
    personal_unique_thing TEXT,
    communication_style TEXT,
    communication_topics TEXT,
    personal_touch TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT ai_personalities_portfolio_unique UNIQUE (portfolio_id),
    CONSTRAINT ai_personalities_vibe_check CHECK (communication_vibe >= 0 AND communication_vibe <= 100)
);

CREATE INDEX idx_ai_personalities_portfolio_id ON ai_personalities(portfolio_id);

-- ============================================
-- PROJECTS
-- ============================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    project_date VARCHAR(100),
    preview_image_url TEXT,
    display_order INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX idx_projects_enabled ON projects(enabled) WHERE enabled = true;
CREATE INDEX idx_projects_display_order ON projects(portfolio_id, display_order);

CREATE TABLE project_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT project_tags_unique UNIQUE (project_id, tag_name)
);

CREATE INDEX idx_project_tags_project_id ON project_tags(project_id);

CREATE TABLE project_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    link_name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_project_links_project_id ON project_links(project_id);
CREATE INDEX idx_project_links_order ON project_links(project_id, display_order);

CREATE TABLE project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT project_images_max_check CHECK (
        (SELECT COUNT(*) FROM project_images WHERE project_id = project_images.project_id) <= 5
    )
);

CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_images_order ON project_images(project_id, image_order);

-- ============================================
-- SKILLS
-- ============================================

CREATE TABLE skill_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_skill_categories_portfolio_id ON skill_categories(portfolio_id);
CREATE INDEX idx_skill_categories_enabled ON skill_categories(enabled) WHERE enabled = true;
CREATE INDEX idx_skill_categories_order ON skill_categories(portfolio_id, display_order);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT skills_unique UNIQUE (skill_category_id, skill_name)
);

CREATE INDEX idx_skills_category_id ON skills(skill_category_id);
CREATE INDEX idx_skills_order ON skills(skill_category_id, display_order);

-- ============================================
-- QUESTIONS
-- ============================================

CREATE TABLE suggested_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT suggested_questions_question_check CHECK (LENGTH(question) > 0)
);

CREATE INDEX idx_suggested_questions_portfolio_id ON suggested_questions(portfolio_id);
CREATE INDEX idx_suggested_questions_category ON suggested_questions(category);
CREATE INDEX idx_suggested_questions_order ON suggested_questions(portfolio_id, display_order);

-- ============================================
-- TOOLS CONFIGURATION
-- ============================================

CREATE TABLE tools_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    tool_name VARCHAR(50) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT tools_config_unique UNIQUE (portfolio_id, tool_name),
    CONSTRAINT tools_config_name_check CHECK (
        tool_name IN ('personal', 'projects', 'skills', 'hobbies', 'contact', 'resume', 'video', 'location')
    )
);

CREATE INDEX idx_tools_config_portfolio_id ON tools_config(portfolio_id);

-- ============================================
-- TOOLS DATA
-- ============================================

CREATE TABLE personal_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    location TEXT,
    introduction TEXT,
    presentation_photo_url TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT personal_info_portfolio_unique UNIQUE (portfolio_id),
    CONSTRAINT personal_info_age_check CHECK (age IS NULL OR age > 0)
);

CREATE INDEX idx_personal_info_portfolio_id ON personal_info(portfolio_id);
CREATE INDEX idx_personal_info_tags ON personal_info USING GIN(tags);

CREATE TABLE contact_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_info_id UUID NOT NULL REFERENCES contact_info(id) ON DELETE CASCADE,
    platform_name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_social_links_contact_id ON social_links(contact_info_id);
CREATE INDEX idx_social_links_order ON social_links(contact_info_id, display_order);

CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(50) DEFAULT 'application/pdf',
    title VARCHAR(255),
    description TEXT,
    last_updated TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT resumes_portfolio_unique UNIQUE (portfolio_id)
);

CREATE INDEX idx_resumes_portfolio_id ON resumes(portfolio_id);

CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    city VARCHAR(255),
    country VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT locations_portfolio_unique UNIQUE (portfolio_id),
    CONSTRAINT locations_lat_check CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
    CONSTRAINT locations_lng_check CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180))
);

CREATE INDEX idx_locations_portfolio_id ON locations(portfolio_id);
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE TABLE hobbies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT hobbies_portfolio_unique UNIQUE (portfolio_id)
);

CREATE INDEX idx_hobbies_portfolio_id ON hobbies(portfolio_id);

CREATE TABLE hobby_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hobby_id UUID NOT NULL REFERENCES hobbies(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT hobby_images_max_check CHECK (
        (SELECT COUNT(*) FROM hobby_images WHERE hobby_id = hobby_images.hobby_id) <= 3
    )
);

CREATE INDEX idx_hobby_images_hobby_id ON hobby_images(hobby_id);
CREATE INDEX idx_hobby_images_order ON hobby_images(hobby_id, image_order);

-- ============================================
-- INTERACTIONS & ANALYTICS
-- ============================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    visitor_ip VARCHAR(45),
    visitor_location VARCHAR(255),
    question TEXT NOT NULL,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT messages_question_check CHECK (LENGTH(question) > 0)
);

CREATE INDEX idx_messages_portfolio_id ON messages(portfolio_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_visitor_ip ON messages(visitor_ip) WHERE visitor_ip IS NOT NULL;

CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
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
CREATE INDEX idx_analytics_portfolio_date ON analytics(portfolio_id, created_at DESC);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) DEFAULT 'free',
    status VARCHAR(50) DEFAULT 'active',
    monthly_message_limit INTEGER DEFAULT 50,
    messages_used INTEGER DEFAULT 0,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT subscriptions_user_unique UNIQUE (user_id),
    CONSTRAINT subscriptions_plan_check CHECK (plan_type IN ('free', 'pro')),
    CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'cancelled', 'expired')),
    CONSTRAINT subscriptions_limit_check CHECK (monthly_message_limit > 0),
    CONSTRAINT subscriptions_used_check CHECK (messages_used >= 0)
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolio_settings_updated_at BEFORE UPDATE ON portfolio_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_personalities_updated_at BEFORE UPDATE ON ai_personalities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_links_updated_at BEFORE UPDATE ON project_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON skill_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suggested_questions_updated_at BEFORE UPDATE ON suggested_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tools_config_updated_at BEFORE UPDATE ON tools_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hobbies_updated_at BEFORE UPDATE ON hobbies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS (Optional - for convenience)
-- ============================================

-- Portfolio with all related data
CREATE OR REPLACE VIEW portfolio_complete AS
SELECT 
    p.*,
    ps.*,
    ai.*,
    u.email,
    u.name as user_name,
    u.avatar_url as user_avatar,
    s.plan_type,
    s.monthly_message_limit,
    s.messages_used
FROM portfolios p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN portfolio_settings ps ON p.id = ps.portfolio_id
LEFT JOIN ai_personalities ai ON p.id = ai.portfolio_id
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE p.status = 'published';

-- ============================================
-- INITIAL DATA (Default Questions)
-- ============================================

-- Function to insert default questions for a portfolio
CREATE OR REPLACE FUNCTION insert_default_questions(portfolio_uuid UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO suggested_questions (portfolio_id, question, category, is_default, display_order) VALUES
    (portfolio_uuid, 'Who are you?', 'About Me', true, 1),
    (portfolio_uuid, 'What are your passions?', 'About Me', true, 2),
    (portfolio_uuid, 'Can I see your resume?', 'Professional', true, 1),
    (portfolio_uuid, 'Why should I hire you?', 'Professional', true, 2),
    (portfolio_uuid, 'What projects are you most proud of?', 'Projects', true, 1),
    (portfolio_uuid, 'What are your skills?', 'Skills', true, 1),
    (portfolio_uuid, 'What''s the craziest thing you''ve ever done?', 'Fun & Personal', true, 1),
    (portfolio_uuid, 'How can I reach you?', 'Contact', true, 1);
END;
$$ LANGUAGE plpgsql;

-- Function to insert default tools config for a portfolio
CREATE OR REPLACE FUNCTION insert_default_tools_config(portfolio_uuid UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO tools_config (portfolio_id, tool_name, enabled) VALUES
    (portfolio_uuid, 'personal', true),
    (portfolio_uuid, 'projects', true),
    (portfolio_uuid, 'skills', true),
    (portfolio_uuid, 'hobbies', false),
    (portfolio_uuid, 'contact', false),
    (portfolio_uuid, 'resume', false),
    (portfolio_uuid, 'video', false),
    (portfolio_uuid, 'location', false);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create default settings when portfolio is created
CREATE OR REPLACE FUNCTION initialize_portfolio_defaults()
RETURNS TRIGGER AS $$
BEGIN
    -- Create default settings
    INSERT INTO portfolio_settings (portfolio_id) VALUES (NEW.id);
    
    -- Create default AI personality
    INSERT INTO ai_personalities (portfolio_id) VALUES (NEW.id);
    
    -- Insert default questions
    PERFORM insert_default_questions(NEW.id);
    
    -- Insert default tools config
    PERFORM insert_default_tools_config(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_portfolio_create AFTER INSERT ON portfolios
FOR EACH ROW EXECUTE FUNCTION initialize_portfolio_defaults();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get portfolio usage statistics
CREATE OR REPLACE FUNCTION get_portfolio_stats(portfolio_uuid UUID)
RETURNS TABLE (
    total_messages INTEGER,
    messages_today INTEGER,
    total_projects INTEGER,
    total_skills INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM messages WHERE portfolio_id = portfolio_uuid) as total_messages,
        (SELECT COUNT(*)::INTEGER FROM messages 
         WHERE portfolio_id = portfolio_uuid 
         AND DATE(created_at) = CURRENT_DATE) as messages_today,
        (SELECT COUNT(*)::INTEGER FROM projects WHERE portfolio_id = portfolio_uuid AND enabled = true) as total_projects,
        (SELECT COUNT(*)::INTEGER FROM skills 
         JOIN skill_categories sc ON skills.skill_category_id = sc.id 
         WHERE sc.portfolio_id = portfolio_uuid AND sc.enabled = true) as total_skills;
END;
$$ LANGUAGE plpgsql;

