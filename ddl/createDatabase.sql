-- Create the database (optional, depending on your setup)
CREATE DATABASE IF NOT EXISTS nullPointersDatabase;
USE nullPointersDatabase;

-- Table: accounts (stores user information for students and admins)
CREATE TABLE accounts (
    user_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique ID for each user
    name VARCHAR(100) NOT NULL,              -- Full name of the user
    email VARCHAR(255) UNIQUE NOT NULL,      -- Email (used for login/contact)
    phone VARCHAR(20) NULL,                  -- Contact number (optional)
    role ENUM('student', 'admin') NOT NULL,  -- Defines if user is a student or admin
    password VARCHAR(255) NOT NULL           -- Hashed password for security
);

-- Table: courses (stores general course details)
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each course
    course_code VARCHAR(20) UNIQUE NOT NULL,  -- Short course identifier (e.g., "CS101")
    course_name VARCHAR(100) NOT NULL,        -- Full name of the course (e.g., "Introduction to Programming")
    department VARCHAR(50) NOT NULL,          -- Department offering the course (e.g., "Computer Science")
    credits INT NOT NULL,                     -- Number of credit hours
    requires_lab BOOLEAN DEFAULT FALSE        -- Indicates if the course requires a lab
);

-- Table: sections (stores different class sections of a course)
CREATE TABLE sections (
    section_id INT AUTO_INCREMENT PRIMARY KEY,   -- Unique section identifier
    course_id INT NOT NULL,                      -- References the course it belongs to
    section_number VARCHAR(10) NOT NULL,         -- Section number (e.g., "A01", "B02")
    instructor VARCHAR(100) NOT NULL,            -- Instructor's name
    schedule VARCHAR(255) NOT NULL,              -- Class schedule (e.g., "Mon/Wed 10-11 AM")
    room VARCHAR(50) NULL,                       -- Classroom location
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Table: planned_schedules (stores students' planned courses before enrollment)
CREATE TABLE planned_schedules (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique schedule plan ID
    student_id INT NOT NULL,                 -- References the student creating the plan
    section_id INT NOT NULL,                 -- Course section added to the plan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the plan was made
    FOREIGN KEY (student_id) REFERENCES accounts(user_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

-- Table: enrollments (tracks students' courses and grades)
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique record ID
    student_id INT NOT NULL,                       -- References the student (from accounts)
    section_id INT NOT NULL,                       -- References the course section
    grade VARCHAR(5) NULL,                         -- Final grade (e.g., "A", "B+", "C")
    FOREIGN KEY (student_id) REFERENCES accounts(user_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

-- Table: prerequisites (stores course prerequisite relationships)
CREATE TABLE prerequisites (
    course_id INT NOT NULL,       -- The course that requires a prerequisite
    prereq_course_id INT NOT NULL,-- The required prerequisite course
    PRIMARY KEY (course_id, prereq_course_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (prereq_course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Table: course_lab_sections (stores lab sections for courses that require labs)
CREATE TABLE course_lab_sections (
    lab_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique lab section identifier
    section_id INT NOT NULL,                -- References the course section
    lab_schedule VARCHAR(255) NOT NULL,     -- Lab schedule (e.g., "Thu 2-4 PM")
    lab_room VARCHAR(50) NULL,              -- Lab location
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(255)
);


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    grade DECIMAL(5, 2) DEFAULT NULL
);