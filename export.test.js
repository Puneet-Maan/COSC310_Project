const request = require('supertest');
const app = require('../server');
const fs = require('fs');
const path = require('path');

const exportsDir = path.join(__dirname, '../exports');

describe("Export student reports", () => {
  beforeAll(() => {
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
    }
  });

  afterEach(() => {
    const files = fs.readdirSync(exportsDir);
    files.forEach(file => fs.unlinkSync(path.join(exportsDir, file)));
  });

  test("should export students as JSON", async () => {
    const response = await request(app).get("/api/students/export/json");
    expect(response.status).toBe(200);
    
    // Check if the response contains the file name
    expect(response.headers['content-disposition']).toContain("students.json");

    // Check if the file is created in the exports directory
    const filePath = path.join(exportsDir, 'students.json');
    expect(fs.existsSync(filePath)).toBe(true);
    fs.unlinkSync(filePath);
  });

  test("should export students as CSV", async () => {
    const response = await request(app).get("/api/students/export/csv");
    expect(response.status).toBe(200);

    expect(response.headers['content-disposition']).toContain("students.csv");
    const filePath = path.join(exportsDir, 'students.csv');
    expect(fs.existsSync(filePath)).toBe(true);
    fs.unlinkSync(filePath);
  });

  test("should export students as TXT", async () => {
    const response = await request(app).get("/api/students/export/txt");
    expect(response.status).toBe(200);

    expect(response.headers['content-disposition']).toContain("students.txt");

    const filePath = path.join(exportsDir, 'students.txt');
    expect(fs.existsSync(filePath)).toBe(true);

    fs.unlinkSync(filePath);
  });
});
