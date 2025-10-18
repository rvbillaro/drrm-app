-- Add verification fields to users table
-- Run this migration to add email and phone verification columns

USE drrm_app;

ALTER TABLE users
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER email,
ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE AFTER phone,
ADD COLUMN email_verification_code VARCHAR(6) AFTER phone_verified,
ADD COLUMN phone_verification_code VARCHAR(6) AFTER email_verification_code,
ADD COLUMN verification_code_expires_at DATETIME AFTER phone_verification_code;
