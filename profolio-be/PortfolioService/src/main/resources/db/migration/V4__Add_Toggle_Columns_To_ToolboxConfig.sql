ALTER TABLE toolbox_config
ADD COLUMN is_global_enabled BOOLEAN DEFAULT true,
ADD COLUMN is_projects_enabled BOOLEAN DEFAULT true,
ADD COLUMN is_skills_enabled BOOLEAN DEFAULT true,
ADD COLUMN is_me_enabled BOOLEAN DEFAULT true,
ADD COLUMN is_hobbies_enabled BOOLEAN DEFAULT true,
ADD COLUMN is_contact_enabled BOOLEAN DEFAULT true,
ADD COLUMN is_resume_enabled BOOLEAN DEFAULT true,
ADD COLUMN is_video_enabled BOOLEAN DEFAULT true,
ADD COLUMN is_location_enabled BOOLEAN DEFAULT true;
