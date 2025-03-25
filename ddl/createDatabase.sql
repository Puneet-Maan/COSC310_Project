CREATE DATABASE studentPortal;


CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) NOT NULL,
       password VARCHAR(255) NOT NULL,
       role ENUM('student', 'admin') DEFAULT 'student'
     );


CREATE TABLE students (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) UNIQUE,
       age INT,
       major VARCHAR(255),
       user_id INT,
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
     );


CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);



CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    course_id INT,
    grade INT CHECK (grade >= 0 AND grade <= 100),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);



INSERT INTO users (username, password, role)
VALUES
    ('student1', 'password123', 'student'),
    ('student2', 'mypassword', 'student'),
    ('admin1', 'adminpass', 'admin');

INSERT INTO students (name, email, age, major, user_id)
VALUES
    ('John Doe', 'johndoe@example.com', 20, 'Computer Science', 1),
    ('Jane Smith', 'janesmith@example.com', 22, 'Mathematics', 2);

INSERT INTO courses (name, description)
VALUES
    ('Introduction to Programming', 'Learn the basics of programming.'),
    ('Advanced Mathematics', 'Dive deep into mathematical concepts.');

INSERT INTO enrollments (student_id, course_id)
VALUES
    (1, 1),
    (2, 2);


ALTER TABLE enrollments DROP FOREIGN KEY enrollments_ibfk_2;


DROP TABLE courses;


DROP TABLE enrollments;

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    schedule VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    enrolled INT DEFAULT 0
);

CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE (student_id, course_id)
);

CREATE TABLE waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    position INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);


INSERT INTO courses (name, code, instructor, schedule, capacity, enrolled)
VALUES ('Testing Course', 'TEST101', 'Dr. Test', 'Mon 10:00 AM - 11:00 AM', 1, 0);

INSERT INTO courses (name, code, instructor, schedule, capacity, enrolled) VALUES
    ('Introduction to Programming', 'CS101', 'Dr. Alice', 'Mon/Wed/Fri 10:00 AM - 11:30 AM', 30, 0),
    ('Data Structures', 'CS201', 'Dr. Bob', 'Tue/Thu 1:00 PM - 2:30 PM', 25, 0),
    ('Machine Learning', 'CS301', 'Dr. Carol', 'Mon/Wed 3:00 PM - 4:30 PM', 20, 0),
    ('Web Development', 'CS401', 'Dr. Eve', 'Fri 1:00 PM - 4:00 PM', 15, 0), 
    ('Database Systems', 'CS501', 'Dr. Dave', 'Tue/Thu 10:00 AM - 11:30 AM', 20, 0);

ALTER TABLE users ADD CONSTRAINT UNIQUE (username);



SET @sql = NULL;



SELECT GROUP_CONCAT(CONCAT('DESCRIBE ', table_name, ';') SEPARATOR ' ') 
INTO @sql
FROM information_schema.tables 
WHERE table_schema = DATABASE();

CREATE TABLE notifications (
    id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

