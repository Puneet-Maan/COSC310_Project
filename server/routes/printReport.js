const express = require('express');
const router = express.Router();

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

module.exports = router;
