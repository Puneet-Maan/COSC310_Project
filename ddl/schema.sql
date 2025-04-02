CREATE DATABASE IF NOT EXISTS cosc310_project;
USE cosc310_project;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL
);

-- Students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT NOT NULL,
    major VARCHAR(50),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Courses table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    instructor VARCHAR(100) NOT NULL,
    schedule VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    enrolled INT DEFAULT 0
);

-- Enrollments table
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade INT,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Waitlist table
CREATE TABLE waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Calendar events table
CREATE TABLE calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Insert an admin user
INSERT INTO users (username, password, role) 
VALUES ('admin', 'password', 'admin'); -- Replace with a hashed password

-- Insert a student user
INSERT INTO users (username, password, role) 
VALUES ('student_user', 'password', 'student'); -- Replace with a hashed password

-- Insert a student profile linked to the student user
INSERT INTO students (name, email, age, major, user_id) 
VALUES ('John Doe', 'johndoe@example.com', 20, 'Computer Science', 2); -- Assuming user_id 2 is the student

-- Insert three courses
INSERT INTO courses (name, code, instructor, schedule, capacity, enrolled) 
VALUES 
('Introduction to Programming', 'COSC101', 'Dr. Smith', 'Mon/Wed 10:00 AM - 11:30 AM', 30, 0),
('Data Structures', 'COSC201', 'Dr. Johnson', 'Tue/Thu 1:00 PM - 2:30 PM', 25, 0),
('Database Systems', 'COSC301', 'Dr. Brown', 'Fri 9:00 AM - 12:00 PM', 20, 0);
