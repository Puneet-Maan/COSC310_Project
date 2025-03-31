SELECT * FROM studentPortal.enrollments;

ALTER TABLE enrollments ADD COLUMN grade VARCHAR(5) DEFAULT NULL;

UPDATE enrollments SET grade = 'A' WHERE student_id = 1 AND course_id = 1;
UPDATE enrollments SET grade = 'B+' WHERE student_id = 2 AND course_id = 2;

SELECT * FROM enrollments WHERE student_id = 1;

UPDATE enrollments
SET grade = 'B+'
WHERE student_id = 1 AND course_id = 2;

UPDATE enrollments
SET grade = 'A'
WHERE student_id = 1 AND course_id = 1;

SELECT e.student_id, c.name AS course_name, e.grade
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.student_id = 1;