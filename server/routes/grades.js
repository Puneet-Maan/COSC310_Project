// backend/routes/grades.js
const express = require('express');
const router = express.Router();
const dbPool = require('../db'); // Assuming you are exporting a pool

const allowedGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
const passingGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

router.post('/', async (req, res) => {
    const { studentId, courseId, grade } = req.body;

    if (!allowedGrades.includes(grade.toUpperCase())) {
        return res.status(400).json({ message: `Invalid grade format. Allowed grades are: ${allowedGrades.join(', ')}` });
    }

    let connection;
    try {
        connection = await dbPool.getConnection();
        await connection.beginTransaction();

        // 1. Check if the enrollment exists
        const [enrollmentRows] = await connection.execute(
            'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
            [studentId, courseId]
        );

        if (enrollmentRows.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Enrollment not found for this student and course.' });
        }

        // 2. Determine if the grade indicates completion
        const isPassingGrade = passingGrades.includes(grade.toUpperCase());

        if (isPassingGrade) {
            const completionDate = new Date();
            await connection.execute(
                'INSERT INTO completed_courses (student_id, course_id, completion_date, grade) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE completion_date = ?, grade = ?',
                [studentId, courseId, completionDate, grade, completionDate, grade]
            );

            // 3. Remove the enrollment
            await connection.execute(
                'DELETE FROM enrollments WHERE student_id = ? AND course_id = ?',
                [studentId, courseId]
            );

            // 4. Decrement the enrolled count in the courses table
            await connection.execute(
                'UPDATE courses SET enrolled = enrolled - 1 WHERE id = ? AND enrolled > 0',
                [courseId]
            );

            await connection.commit();
            res.json({ message: 'Grade recorded, course marked as completed, removed from enrollments, and enrolled count updated.' });
        } else {
            await connection.commit();
            res.json({ message: 'Grade recorded (not marked as completed due to failing grade).' });
        }
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error recording grade and updating enrollment:', error);
        res.status(500).json({ message: 'Failed to record grade and/or update enrollment.' });
    } finally {
        if (connection) {
            connection.release(); // Release the connection back to the pool
        }
    }
});

module.exports = router;