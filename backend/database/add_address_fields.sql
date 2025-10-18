-- Add address fields to users table
-- Run this migration to add location/address columns

USE drrm_app;

ALTER TABLE users
ADD COLUMN full_address VARCHAR(500) AFTER phone,
ADD COLUMN barangay VARCHAR(100) AFTER full_address,
ADD COLUMN city VARCHAR(100) AFTER barangay,
ADD COLUMN zone ENUM('north', 'south') AFTER city,
ADD COLUMN latitude DECIMAL(10, 8) AFTER zone,
ADD COLUMN longitude DECIMAL(11, 8) AFTER latitude;
