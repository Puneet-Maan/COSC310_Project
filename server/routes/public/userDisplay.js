import express from "express";
import db from "./db.js"; // Ensure the correct database import

const router = express.Router();

// Get User Details by ID
router.get("/api/userdisplay/:userId", async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    const query = `
        SELECT accounts.name, accounts.student_number, accounts.standing, accounts.expected_graduation,
               GROUP_CONCAT(courses.course_name) AS courses
        FROM accounts
        LEFT JOIN enrollments ON accounts.id = enrollments.student_id
        LEFT JOIN courses ON enrollments.course_id = courses.id
        WHERE accounts.id = ?
        GROUP BY accounts.id
    `;

    try {
        const [results] = await db.query(query, [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(results[0]);
    } catch (err) {
        console.error("Error fetching user details:", err);
        res.status(500).json({ message: "Failed to fetch user details.", error: err.message });
    }
});

export default router;
