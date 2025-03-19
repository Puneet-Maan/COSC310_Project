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

CREATE TABLE IF NOT EXISTS students (
             id INT AUTO_INCREMENT PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             course VARCHAR(255),
             grade FLOAT,
             email VARCHAR(255),
             contact VARCHAR(20),
             address VARCHAR(255),
            status VARCHAR(50),
             nationality VARCHAR(50),
             program VARCHAR(255),
             faculty VARCHAR(255)
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

-- Table: waitlist (stores students waiting for full courses)
CREATE TABLE waitlist (
    waitlist_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique waitlist entry ID
    student_id INT NOT NULL,                    -- References the student who is waiting
    section_id INT NOT NULL,                    -- References the course section the student wants to join
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the student was added to the waitlist
    FOREIGN KEY (student_id) REFERENCES accounts(user_id) ON DELETE CASCADE,
    FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE CASCADE,
    UNIQUE (student_id, section_id)             -- Ensure a student can't be on the waitlist for the same course twice
);