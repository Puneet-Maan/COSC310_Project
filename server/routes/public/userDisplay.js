router.get('/api/userdisplay', (req, res) => {
    const userId = req.query.id;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    const sql = `
        SELECT accounts.name, accounts.student_number, accounts.standing, accounts.expected_graduation,
               GROUP_CONCAT(courses.course_name) AS courses
        FROM accounts
        LEFT JOIN enrollments ON accounts.id = enrollments.student_id
        LEFT JOIN courses ON enrollments.course_id = courses.id
        WHERE accounts.id = ?
        GROUP BY accounts.id
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.json(results[0]);
        }
    });
});
