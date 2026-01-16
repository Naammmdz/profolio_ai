-- Update users table to match DATABASE_DESIGN.md specification
-- This migration updates the users table structure

-- Step 1: Add new columns
ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE,
    ADD COLUMN IF NOT EXISTS name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS provider VARCHAR(50),
    ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 2: Make password nullable (for OAuth providers)
ALTER TABLE users 
    ALTER COLUMN password DROP NOT NULL;

-- Step 3: Update email column length
ALTER TABLE users 
    ALTER COLUMN email TYPE VARCHAR(255);

-- Step 4: Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider, provider_id);

-- Step 5: Add email validation constraint
ALTER TABLE users 
    ADD CONSTRAINT users_email_check 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Step 6: Migrate id from INTEGER to UUID
-- This is a complex migration that requires:
-- 1. Create new UUID column
-- 2. Generate UUIDs for existing records
-- 3. Update foreign key references
-- 4. Drop old column and rename new one

-- Add temporary UUID column
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_new UUID DEFAULT gen_random_uuid();

-- Generate UUIDs for existing records (if any)
UPDATE users SET id_new = gen_random_uuid() WHERE id_new IS NULL;

-- Update user_roles table to use new UUID
-- First, add new column
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS user_id_new UUID;

-- Copy data with UUID mapping
UPDATE user_roles ur
SET user_id_new = u.id_new
FROM users u
WHERE ur.user_id = u.id;

-- Drop old foreign key constraint
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;

-- Drop old column
ALTER TABLE user_roles DROP COLUMN IF EXISTS user_id;

-- Rename new column
ALTER TABLE user_roles RENAME COLUMN user_id_new TO user_id;

-- Make it NOT NULL
ALTER TABLE user_roles ALTER COLUMN user_id SET NOT NULL;

-- Recreate primary key
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE user_roles ADD PRIMARY KEY (user_id, role_id);

-- Now update users table
-- Drop old primary key
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;

-- Drop old id column
ALTER TABLE users DROP COLUMN IF EXISTS id;

-- Rename new column
ALTER TABLE users RENAME COLUMN id_new TO id;

-- Make it primary key and NOT NULL
ALTER TABLE users ALTER COLUMN id SET NOT NULL;
ALTER TABLE users ADD PRIMARY KEY (id);

-- Recreate foreign key
ALTER TABLE user_roles 
    ADD CONSTRAINT user_roles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Set default for new records
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();
