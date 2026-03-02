-- Create Portfolios Table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    theme VARCHAR(50) DEFAULT 'DEFAULT',
    avatar_url TEXT,
    avatar_shape VARCHAR(20) DEFAULT 'SQUARED',
    cursor_animation VARCHAR(20) DEFAULT 'FLUID',
    headline VARCHAR(255),
    tagline VARCHAR(255),
    chat_placeholder VARCHAR(255) DEFAULT 'Ask me anything...',
    show_modal BOOLEAN DEFAULT TRUE,
    modal_title VARCHAR(255),
    modal_content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AI Personalities Table
CREATE TABLE ai_personalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    cv_text TEXT,
    professional_bio TEXT,
    skills TEXT,
    biggest_flex TEXT,
    personal_drives TEXT,
    interests TEXT,
    uniqueness TEXT,
    communication_style TEXT,
    topics_love_discussing TEXT,
    general_context TEXT,
    temperature INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Suggested Questions Table
CREATE TABLE suggested_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    question VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_ai_personalities_portfolio_id ON ai_personalities(portfolio_id);
CREATE INDEX idx_suggested_questions_portfolio_id ON suggested_questions(portfolio_id);
