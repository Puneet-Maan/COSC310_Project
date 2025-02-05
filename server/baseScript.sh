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
"

# Execute the SQL command
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "$SQL_COMMAND"