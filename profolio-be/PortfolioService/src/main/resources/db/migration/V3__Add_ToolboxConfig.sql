-- ToolboxConfig table
CREATE TABLE toolbox_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL UNIQUE REFERENCES portfolios(id) ON DELETE CASCADE,
    
    -- Me Info
    me_name VARCHAR(255),
    me_age VARCHAR(50),
    me_location VARCHAR(255),
    me_introduction TEXT,
    me_tags TEXT[],
    me_photo_url VARCHAR(512),
    
    -- Fun & Hobbies
    hobbies_title VARCHAR(255),
    hobbies_description TEXT,
    hobbies_photos TEXT[],
    
    -- Contact
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_handle VARCHAR(100),
    contact_address VARCHAR(255),
    contact_social_platforms TEXT[],
    contact_social_urls TEXT[],
    
    -- Resume
    resume_title VARCHAR(255),
    resume_description TEXT,
    resume_file_url VARCHAR(512),
    resume_file_name VARCHAR(255),
    
    -- Video
    video_title VARCHAR(255),
    video_url VARCHAR(512),
    video_description TEXT,
    
    -- Location
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_toolbox_config_portfolio ON toolbox_config(portfolio_id);
