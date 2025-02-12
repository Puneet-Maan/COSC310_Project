document.addEventListener("DOMContentLoaded", () => {
    displayCourses();
    displayStudents();
});

let coursesData = [];
let studentsData = [];

// Function to add a new course and display it
function addCourse() {
    let name = document.getElementById("courseName").value;
    let desc = document.getElementById("courseDescription").value;

    if (!name || !desc) {
        alert("Please fill in both fields!");
        return;
    }

    let newCourse = { name, description: desc };
    coursesData.push(newCourse);
    displayCourses();

    document.getElementById("courseName").value = "";
    document.getElementById("courseDescription").value = "";
}

// Function to display courses
function displayCourses() {
    const list = document.getElementById("courseList");
    list.innerHTML = "";

    coursesData.forEach((course, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${course.name} - ${course.description} 
            <button class='delete-btn' onclick='deleteCourse(${index})'>Delete</button>`;
        list.appendChild(li);
    });
}

// Function to delete a course
function deleteCourse(index) {
    coursesData.splice(index, 1);
    displayCourses();
}

// Function to add a new student and display it
function addStudent() {
    let name = document.getElementById("studentName").value;
    let id = document.getElementById("studentID").value;
    let email = document.getElementById("studentEmail").value;
    let courses = document.getElementById("studentCourses").value;
    let grades = document.getElementById("studentGrades").value;

    if (!name || !id || !email || !courses || !grades) {
        alert("Please fill in all fields!");
        return;
    }

    let newStudent = { name, id, email, courses, grades };
    studentsData.push(newStudent);
    displayStudents();

    document.getElementById("studentName").value = "";
    document.getElementById("studentID").value = "";
    document.getElementById("studentEmail").value = "";
    document.getElementById("studentCourses").value = "";
    document.getElementById("studentGrades").value = "";
}

// Function to display students
function displayStudents() {
    const list = document.getElementById("studentList");
    list.innerHTML = "";

    studentsData.forEach((student, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${student.name} (ID: ${student.id}) - ${student.email} - Courses: ${student.courses} - Grades: ${student.grades} 
            <button class='delete-btn' onclick='deleteStudent(${index})'>Delete</button>`;
        list.appendChild(li);
    });
}

// Function to delete a student
function deleteStudent(index) {
    studentsData.splice(index, 1);
    displayStudents();
}
