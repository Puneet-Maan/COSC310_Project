const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config(); // Add this line to load environment variables

router.post('/generate', async (req, res) => {
    const { studentName, enrollments } = req.body;
    
    // Create report content
    let reportContent = `Enrollment Report for ${studentName}\n`;
    reportContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
    reportContent += `Courses:\n`;
    reportContent += `${'-'.repeat(50)}\n`;
    
    enrollments.forEach(enrollment => {
        reportContent += `Course: ${enrollment.course_name} (${enrollment.course_code})\n`;
        reportContent += `Grade: ${enrollment.grade || 'N/A'}\n`;
        reportContent += `${'-'.repeat(50)}\n`;
    });

    // Set headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename=enrollment_report_${studentName.replace(/\s+/g, '_')}.txt`);
    
    // Send the report content
    res.send(reportContent);
});

router.post('/self-generate/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        
        // Get student's enrolled courses from database using correct MySQL parameter syntax
        const result = await pool.query(
            'SELECT c.id, c.name, c.instructor, e.grade FROM courses c ' +
            'JOIN enrollments e ON c.id = e.course_id ' +
            'WHERE e.student_id = ?',
            [studentId]
        );

        const enrollments = result.rows || result[0]; // Handle MySQL response format
        
        // Create report content
        let reportContent = `Enrollment Report\n`;
        reportContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
        reportContent += `Student ID: ${studentId}\n`;
        reportContent += `${'-'.repeat(50)}\n\n`;
        reportContent += `Courses:\n`;
        reportContent += `${'-'.repeat(50)}\n`;
        
        enrollments.forEach(course => {
            reportContent += `Course: ${course.name} (${course.id})\n`;
            reportContent += `Instructor: ${course.instructor}\n`;
            reportContent += `Grade: ${course.grade || 'N/A'}\n`;
            reportContent += `${'-'.repeat(50)}\n`;
        });

        // Set headers for file download
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename=enrollment_report.txt`);
        
        // Send the report content
        res.send(reportContent);
    } catch (error) {
        console.error('Error generating self report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

module.exports = router;
