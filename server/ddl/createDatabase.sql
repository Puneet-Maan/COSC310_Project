-- Create the database (optional, depending on your setup)
CREATE DATABASE IF NOT EXISTS nullPointersDatabase;
USE nullPointersDatabase;


-- Table: faculties (stores different faculties in the university)
CREATE TABLE faculties (
    faculty_id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table: programs (stores different programs within faculties)
CREATE TABLE programs (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    program_name VARCHAR(100) UNIQUE NOT NULL,
    faculty_id INT,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE CASCADE
);

-- Table: accounts (stores student/admin user information)
CREATE TABLE accounts (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email LIKE '%@ubc.ca'),
    phone VARCHAR(20) NULL,
    role ENUM('student', 'admin') NOT NULL,
    password VARCHAR(255) NOT NULL,
    faculty_id INT NULL,
    program_id INT NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculties(faculty_id) ON DELETE SET NULL,
    FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE SET NULL
);

-- Table: courses (stores general course details)
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

-- Table: sections (stores different class sections for courses)
CREATE TABLE sections (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    section_number VARCHAR(10) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    schedule VARCHAR(255) NOT NULL,
    room VARCHAR(50) NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Table: planned_schedules (stores students' planned courses before actual enrollment)
CREATE TABLE planned_schedules (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES accounts(user_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

-- Table: enrollments (tracks students' enrolled courses and final grades)
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    grade VARCHAR(5) NULL,
    FOREIGN KEY (student_id) REFERENCES accounts(user_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

-- Table: prerequisites (stores course prerequisite relationships)
CREATE TABLE prerequisites (
    course_id INT NOT NULL,
    prereq_course_id INT NOT NULL,
    PRIMARY KEY (course_id, prereq_course_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (prereq_course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Table: course_lab_sections (stores lab sections for courses that require labs)
CREATE TABLE course_lab_sections (
    lab_id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT NOT NULL,
    lab_schedule VARCHAR(255) NOT NULL,
    lab_room VARCHAR(50) NULL,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

-- Table: waitlist (stores students waiting for full courses)
CREATE TABLE waitlist (
    waitlist_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES accounts(user_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE,
    UNIQUE (student_id, section_id)
);

