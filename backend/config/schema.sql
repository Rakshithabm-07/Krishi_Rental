-- ============================================================
-- Krishi Rental System - MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS krishi_rental;
USE krishi_rental;

-- USERS TABLE (Admin + Farmer)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('admin', 'farmer') NOT NULL,
    aadhar_number VARCHAR(20),
    aadhar_image VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCERS TABLE
CREATE TABLE IF NOT EXISTS producers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QC PERSONS TABLE
CREATE TABLE IF NOT EXISTS qc_persons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producer_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE CASCADE
);

-- EQUIPMENTS TABLE
CREATE TABLE IF NOT EXISTS equipments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producer_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    used_for VARCHAR(255),
    rent_per_day DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    max_days INT NOT NULL,
    safety_deposit DECIMAL(10,2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE CASCADE
);

-- RENTALS TABLE
CREATE TABLE IF NOT EXISTS rentals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    equipment_id INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    max_days INT NOT NULL,
    selected_days INT NOT NULL,
    safety_deposit DECIMAL(10,2) NOT NULL,
    rent_total DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    payment_mode ENUM('upi', 'card') NOT NULL,
    status ENUM('in_rent', 'in_qc', 'returned', 'rejected') DEFAULT 'in_rent',
    delay_fine DECIMAL(10,2) DEFAULT 0,
    damage_fine DECIMAL(10,2) DEFAULT 0,
    returning_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_id) REFERENCES equipments(id) ON DELETE CASCADE
);

-- ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rental_id INT NOT NULL,
    farmer_id INT NOT NULL,
    producer_id INT NOT NULL,
    message TEXT,
    is_seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (producer_id) REFERENCES producers(id) ON DELETE CASCADE
);

-- Insert default admin
INSERT IGNORE INTO users (name, email, password, role, phone)
VALUES ('Admin', 'admin@krishi.com', SHA2('admin123', 256), 'admin', '9999999999');
