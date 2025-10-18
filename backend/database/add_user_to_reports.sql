-- Add user_id to incident_reports table
-- Run this migration to link reports to users

USE drrm_app;

ALTER TABLE incident_reports
ADD COLUMN user_id INT AFTER id,
ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
