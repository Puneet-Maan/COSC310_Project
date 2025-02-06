#!/bin/bash

# Variables
DB_NAME="nullPointersDatabase"
DB_USER="root"
DB_HOST="127.0.0.1"
DB_PORT="3306"

# SQL command
SQL_COMMAND="
INSERT INTO courses (course_code, course_name, department, credits, requires_lab) VALUES
('BIOL116','Biology for Science Majors I','Science',3,TRUE),
('BIOL125','Biology for Science Majors II','Science',3,TRUE),
('CHEM121','Atomic and Molecular Chemistry','Science',3,TRUE),
('CHEM123','Physical and Organic Chemistry','Science',3,TRUE),
('COSC111','Computer Programming I','Science',3,TRUE),
('COSC121', 'Computer Programing II', 'Science', 3, TRUE),
('COSC123','Computer Creativity', 'Science',3,TRUE),
('COSC211','Machine Architecture','Science',3,FALSE),
('COSC222','Data Structures','Science',3,TRUE),
('COSC221','Discrete Structures in Computing','Science', 3, TRUE),
('COSC304','Introduction to Databases','Science', 3, TRUE),
('COSC305','Project Management','Science',3,FALSE),
('COSC310','Software Engineering','Science',3,FALSE),
('COSC320','Analysis of Algorithms','Science',3,FALSE),
('COSC341','Human Computer Interaction','Science',3,FALSE),
('COSC360','Web Programming','Science',3,TRUE),
('COSC407','Introduction to Parallel Computing','Science',3,TRUE),
('DATA101','Making Predictions with Data','Science',3,TRUE),
('DATA301','Introduction to Data Analystics','Science',3,TRUE),
('DATA311','Machine Learning','Science',3,TRUE);

INSERT INTO accounts (name, email, phone, role, password) VALUES
('John Doe', 'john.doe@example.com', '123-456-7890', 'student', 'hashedpassword1'),
('Jane Smith', 'jane.smith@example.com', '234-567-8901', 'student', 'hashedpassword2'),
('Alice Johnson', 'alice.johnson@example.com', '345-678-9012', 'student', 'hashedpassword3'),
('Bob Brown', 'bob.brown@example.com', '456-789-0123', 'student', 'hashedpassword4'),
('Charlie Davis', 'charlie.davis@example.com', '567-890-1234', 'student', 'hashedpassword5'),
('David Evans', 'david.evans@example.com', '678-901-2345', 'student', 'hashedpassword6'),
('Eve Foster', 'eve.foster@example.com', '789-012-3456', 'student', 'hashedpassword7'),
('Frank Green', 'frank.green@example.com', '890-123-4567', 'student', 'hashedpassword8'),
('Grace Harris', 'grace.harris@example.com', '901-234-5678', 'student', 'hashedpassword9'),
('Hank Irving', 'hank.irving@example.com', '012-345-6789', 'admin', 'hashedpassword10');

INSERT INTO sections (course_id, section_number, instructor, schedule, room) VALUES
(1, 'A01', 'Dr. Smith', 'Mon/Wed 10-11 AM', 'Room 101'),
(2, 'A02', 'Dr. Johnson', 'Tue/Thu 1-2 PM', 'Room 102'),
(3, 'B01', 'Dr. Brown', 'Mon/Wed 2-3 PM', 'Room 103'),
(4, 'B02', 'Dr. Davis', 'Tue/Thu 3-4 PM', 'Room 104'),
(5, 'C01', 'Dr. Evans', 'Mon/Wed 4-5 PM', 'Room 105'),
(6, 'C02', 'Dr. Foster', 'Tue/Thu 5-6 PM', 'Room 106'),
(7, 'D01', 'Dr. Green', 'Mon/Wed 6-7 PM', 'Room 107'),
(8, 'D02', 'Dr. Harris', 'Tue/Thu 7-8 PM', 'Room 108'),
(9, 'E01', 'Dr. Irving', 'Mon/Wed 8-9 PM', 'Room 109'),
(10, 'E02', 'Dr. Smith', 'Tue/Thu 9-10 PM', 'Room 110');

INSERT INTO planned_schedules (student_id, section_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10);

INSERT INTO enrollments (student_id, section_id, grade) VALUES
(1, 1, 'A'),
(2, 2, 'B+'),
(3, 3, 'B'),
(4, 4, 'A-'),
(5, 5, 'C+'),
(6, 6, 'B-'),
(7, 7, 'A'),
(8, 8, 'B+'),
(9, 9, 'C'),
(10, 10, 'A-');

INSERT INTO prerequisites (course_id, prereq_course_id) VALUES
(2, 1),
(3, 1),
(4, 3),
(5, 1),
(6, 5),
(7, 5),
(8, 5),
(9, 8),
(10, 9),
(11, 10);

INSERT INTO course_lab_sections (section_id, lab_schedule, lab_room) VALUES
(1, 'Thu 2-4 PM', 'Lab 101'),
(2, 'Fri 1-3 PM', 'Lab 102'),
(3, 'Thu 4-6 PM', 'Lab 103'),
(4, 'Fri 3-5 PM', 'Lab 104'),
(5, 'Thu 6-8 PM', 'Lab 105'),
(6, 'Fri 5-7 PM', 'Lab 106'),
(7, 'Thu 8-10 PM', 'Lab 107'),
(8, 'Fri 7-9 PM', 'Lab 108'),
(9, 'Thu 10-12 PM', 'Lab 109'),
(10, 'Fri 9-11 PM', 'Lab 110');
"

# Execute the SQL command
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "$SQL_COMMAND"
