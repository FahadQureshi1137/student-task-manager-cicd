-- Student Task Manager Database
-- Run this file to set up the database

CREATE DATABASE IF NOT EXISTS taskmanager;
USE taskmanager;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject VARCHAR(100),
    due_date DATE,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO tasks (title, description, subject, due_date, priority, status) VALUES
('Math Assignment', 'Complete exercises 1-20 from chapter 5', 'Mathematics', '2025-06-01', 'high', 'pending'),
('History Essay', 'Write 500 words on World War II causes', 'History', '2025-06-05', 'medium', 'in_progress'),
('Science Lab Report', 'Document results from the photosynthesis experiment', 'Science', '2025-05-28', 'high', 'pending'),
('Read Chapter 7', 'English Literature - Pride and Prejudice', 'English', '2025-05-25', 'low', 'completed'),
('Physics Problem Set', 'Newton\'s laws problems - page 102', 'Physics', '2025-06-10', 'medium', 'pending');
