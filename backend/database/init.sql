-- DRRM App Database Initialization
-- Run this script to set up the database tables

CREATE DATABASE IF NOT EXISTS drrm_app;
USE drrm_app;

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('warning', 'danger', 'info') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    time VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Incident reports table
CREATE TABLE IF NOT EXISTS incident_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location_address VARCHAR(500) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    media_files JSON,
    timestamp DATETIME NOT NULL,
    status ENUM('pending', 'processing', 'resolved') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table (for future authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Relief centers table
CREATE TABLE IF NOT EXISTS relief_centers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    services JSON,
    contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Hotlines table
CREATE TABLE IF NOT EXISTS hotlines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('training', 'drill') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(10) NOT NULL,
    location VARCHAR(255),
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO alerts (type, title, message, time, location, timestamp) VALUES
('danger', 'Flash Flood Warning', 'Heavy rainfall expected. Residents in low-lying areas advised to evacuate immediately.', '5 mins ago', 'North Zone', DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
('warning', 'Typhoon Alert', 'Typhoon Pepito approaching. Signal No. 2 raised in Metro Manila.', '15 mins ago', 'All Areas', DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
('danger', 'Fire Alert', 'Fire reported in Residential Area Block 5. Fire trucks dispatched.', '4 hours ago', 'South Zone', DATE_SUB(NOW(), INTERVAL 4 HOUR));

INSERT INTO schedules (type, title, description, date, time, location, timestamp) VALUES
('training', 'Emergency Response Training', 'Basic first aid and evacuation procedures training session.', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '09:00', 'Barangay Hall A', NOW()),
('drill', 'Fire Evacuation Drill', 'Simulated fire emergency evacuation drill for all residents.', DATE_ADD(CURDATE(), INTERVAL 14 DAY), '14:00', 'Community Center B', DATE_ADD(NOW(), INTERVAL 1 DAY)),
('training', 'Flood Preparedness Workshop', 'Learn about flood prevention and emergency kits preparation.', DATE_ADD(CURDATE(), INTERVAL 21 DAY), '10:00', 'School Gym C', DATE_ADD(NOW(), INTERVAL 2 DAY));

INSERT INTO hotlines (name, number, category, description) VALUES
('Emergency Hotline', '911', 'Emergency', 'General emergency services'),
('Fire Department', '160', 'Fire', 'Fire emergency response'),
('Police', '117', 'Police', 'Law enforcement'),
('Medical Emergency', '143', 'Medical', 'Medical assistance'),
('Coast Guard', '0917-123-4567', 'Maritime', 'Maritime emergencies');

INSERT INTO relief_centers (name, address, latitude, longitude, capacity, services, contact) VALUES
('Barangay Hall A', '123 Main St, Barangay A', 14.5995, 120.9842, 500, '["Food", "Water", "Shelter"]', '0917-987-6543'),
('Community Center B', '456 Oak Ave, Barangay B', 14.6015, 120.9862, 300, '["Medical", "Food", "Water"]', '0918-123-7890'),
('School Gym C', '789 Pine Rd, Barangay C', 14.6035, 120.9882, 200, '["Shelter", "Water"]', '0919-456-1234');
