-- Add user_id to relief_requests table
USE drrm_app;

ALTER TABLE relief_requests
ADD COLUMN user_id INT AFTER id,
ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
