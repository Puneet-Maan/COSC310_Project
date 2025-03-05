// Import necessary dependencies
const { fetchCourses, addCourse, deleteCourse, fetchStudents, addStudent, deleteStudent } = require('../script');
import fetchMock from 'jest-fetch-mock';

// Mock fetch before each test
beforeEach(() => {
    fetchMock.resetMocks();
    document.body.innerHTML = `
        <input id="courseName" />
        <input id="courseDescription" />
        <button id="addCourseBtn"></button>
        <ul id="courseList"></ul>
        
        <input id="studentName" />
        <input id="studentID" />
        <input id="studentEmail" />
        <button id="addStudentBtn"></button>
        <ul id="studentList"></ul>
    `;
});

// Test fetching courses from backend
test('fetchCourses should populate courseList', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([
        { id: 1, name: "Math 101", description: "Basic Math" },
        { id: 2, name: "Physics 101", description: "Basic Physics" }
    ]));

    await fetchCourses();

    const listItems = document.querySelectorAll("#courseList li");
    expect(listItems.length).toBe(2);
    expect(listItems[0].textContent).toContain("Math 101");
    expect(listItems[1].textContent).toContain("Physics 101");
});

// Test adding a new course
test('addCourse should send a POST request and reload courses', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: "Course added successfully!", courseId: 1 }), { status: 201 });

    document.getElementById("courseName").value = "Biology 101";
    document.getElementById("courseDescription").value = "Introduction to Biology";

    await addCourse();

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:5000/admin/add-course", expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Biology 101", description: "Introduction to Biology" })
    }));
});

// Test deleting a course
test('deleteCourse should send a DELETE request', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: "Course deleted successfully!" }), { status: 200 });

    await deleteCourse(1);

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:5000/admin/delete-course/1", { method: "DELETE" });
});

//  Test fetching students from backend
test('fetchStudents should populate studentList', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([
        { id: 1, name: "Alice", email: "alice@example.com", enrolled_courses: "Math", grades: "A" },
        { id: 2, name: "Bob", email: "bob@example.com", enrolled_courses: "Physics", grades: "B" }
    ]));

    await fetchStudents();

    const listItems = document.querySelectorAll("#studentList li");
    expect(listItems.length).toBe(2);
    expect(listItems[0].textContent).toContain("Alice");
    expect(listItems[1].textContent).toContain("Bob");
});

//  Test adding a student
test('addStudent should send a POST request and reload students', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: "Student added successfully!", studentId: 1 }), { status: 201 });

    document.getElementById("studentName").value = "Charlie";
    document.getElementById("studentID").value = "12345";
    document.getElementById("studentEmail").value = "charlie@example.com";

    await addStudent();

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:5000/admin/add-student", expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Charlie", email: "charlie@example.com", student_id: "12345" })
    }));
});

//  Test deleting a student
test('deleteStudent should send a DELETE request', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: "Student deleted successfully!" }), { status: 200 });

    await deleteStudent(1);

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:5000/admin/delete-student/1", { method: "DELETE" });
});
