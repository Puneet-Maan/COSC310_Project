-- Create Database (if not exists)
CREATE DATABASE IF NOT EXISTS nullPointersDatabase;
USE nullPointersDatabase;

-- 📌 Table: Faculties
CREATE TABLE faculties (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_name VARCHAR(100) UNIQUE NOT NULL
);

-- 📌 Table: Programs (linked to Faculties)
CREATE TABLE programs (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    program_name VARCHAR(100) UNIQUE NOT NULL,
    faculty_id INT,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE CASCADE
);

-- 📌 Table: Accounts (students & admins)
CREATE TABLE accounts (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email LIKE '%@ubc.ca'), -- Only UBC emails allowed
    phone VARCHAR(20) NULL,
    role ENUM('student', 'admin') NOT NULL,
    password VARCHAR(255) NOT NULL,
    faculty_id INT NULL,
    program_id INT NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE SET NULL,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE SET NULL
);

-- 📌 Table: Courses
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    credits INT NOT NULL,
    requires_lab BOOLEAN DEFAULT FALSE,
    program_id INT,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE SET NULL
);

-- 📌 Table: Sections (each course has multiple sections)
CREATE TABLE sections (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    section_number VARCHAR(10) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    schedule VARCHAR(255) NOT NULL,
    room VARCHAR(50) NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 📌 Table: Students
CREATE TABLE students (
    student_id CHAR(8) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    year_level INT NOT NULL,
    program_id INT NOT NULL,
    faculty_id INT NOT NULL,
    login_email VARCHAR(100) NOT NULL UNIQUE CHECK (login_email LIKE '%@ubc.ca'),
    password VARCHAR(50) NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE
);

-- 📌 Table: Planned Schedules (students plan courses before actual enrollment)
CREATE TABLE planned_schedules (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

-- 📌 Table: Enrollments (tracks students’ registered courses & grades)
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    grade VARCHAR(5) NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

-- 📌 Table: Prerequisites (stores course prerequisite relationships)
CREATE TABLE prerequisites (
    course_id INT NOT NULL,
    prereq_course_id INT NOT NULL,
    PRIMARY KEY (course_id, prereq_course_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (prereq_course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- 📌 Table: Course Lab Sections (for courses that require lab)
CREATE TABLE course_lab_sections (
    lab_id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    lab_schedule VARCHAR(255) NOT NULL,
    lab_room VARCHAR(50) NULL,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

-- 📌 Table: Waitlist (students waiting for full courses)
CREATE TABLE waitlist (
    waitlist_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE,
    UNIQUE (student_id, section_id) -- Prevent duplicate waitlist entries
);