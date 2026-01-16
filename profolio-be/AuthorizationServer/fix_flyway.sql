-- Fix Flyway checksum mismatch for migration V5
-- Run this SQL in your PostgreSQL database

-- Option 1: Delete migration V5 from history (recommended)
DELETE FROM flyway_schema_history WHERE version = '5';

-- Option 2: Update checksum to match new file (if you want to keep V5)
-- UPDATE flyway_schema_history 
-- SET checksum = -2004368842 
-- WHERE version = '5';

-- After running this, restart the Authorization Server
-- Migration V6 will then run and delete/recreate the OAuth2 client with PKCE disabled
