const express = require("express");
const fs = require("fs");
const path = require("path");
const fastCsv = require("fast-csv");
const db = require("./db"); // Your database connection

const app = express();
const PORT = 5001;

app.use(express.json());

// Ensure the exports directory exists
const exportsDir = path.join(__dirname, "exports");
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir);
}

// Fetch all students
app.get("/api/students", async (req, res) => {
  try {
    const [students] = await db.execute("SELECT * FROM students");
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Database query failed" });
  }
});

// Export JSON
app.get("/api/students/export/json", async (req, res) => {
  try {
    const [students] = await db.execute("SELECT * FROM students");
    const filePath = path.join(exportsDir, "students.json");
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
    res.download(filePath, "students.json", (err) => {
      if (err) res.status(500).json({ error: "Failed to download JSON file" });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to export JSON" });
  }
});

// Export CSV
app.get("/api/students/export/csv", async (req, res) => {
  try {
    const [students] = await db.execute("SELECT * FROM students");
    const filePath = path.join(exportsDir, "students.csv");
    const ws = fs.createWriteStream(filePath);

    fastCsv.write(students, { headers: true }).pipe(ws);

    ws.on("finish", () => {
      res.download(filePath, "students.csv", (err) => {
        if (err) res.status(500).json({ error: "Failed to download CSV file" });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to export CSV" });
  }
});

// Export TXT
app.get("/api/students/export/txt", async (req, res) => {
  try {
    const [students] = await db.execute("SELECT * FROM students");
    const filePath = path.join(exportsDir, "students.txt");
    const fileData = students.map(s => `${s.id}, ${s.name}, ${s.course}, ${s.grade}`).join("\n");
    fs.writeFileSync(filePath, fileData);
    res.download(filePath, "students.txt", (err) => {
      if (err) res.status(500).json({ error: "Failed to download TXT file" });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to export TXT" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
