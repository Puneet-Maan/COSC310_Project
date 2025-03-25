const assert = require('assert');
const request = require('supertest');
const express = require('express');
const printReportRoutes = require('../routes/printReport');

const app = express();
app.use(express.json());
app.use('/report', printReportRoutes);

describe('Print Report API', function () {
  it('POST /report/generate should generate a report file', async function () {
    const mockData = {
      studentName: 'John Doe',
      enrollments: [
        {
          course_name: 'Introduction to Computing',
          course_code: 'COSC101',
          grade: 85
        },
        {
          course_name: 'Data Structures',
          course_code: 'COSC222',
          grade: 90
        }
      ]
    };

    const response = await request(app)
      .post('/report/generate')
      .send(mockData);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.header['content-type'], 'text/plain; charset=utf-8');
    assert.strictEqual(
      response.header['content-disposition'],
      'attachment; filename=enrollment_report_John_Doe.txt'
    );
    assert.ok(response.text.includes('Enrollment Report for John Doe'));
    assert.ok(response.text.includes('COSC101'));
    assert.ok(response.text.includes('COSC222'));
    assert.ok(response.text.includes('85'));
    assert.ok(response.text.includes('90'));
  });
});
