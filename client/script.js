document.addEventListener("DOMContentLoaded", () => {
    fetchCourses();
    fetchStudents();

    const addCourseBtn = document.getElementById("addCourseBtn");
    const addStudentBtn = document.getElementById("addStudentBtn");

    if (addCourseBtn) {
        addCourseBtn.addEventListener("click", addCourse);
    }

    if (addStudentBtn) {
        addStudentBtn.addEventListener("click", addStudent);
    }
});

// 🟢 Function to Fetch and Display Courses from Backend
async function fetchCourses() {
    try {
        const response = await fetch("http://localhost:5000/admin/courses");
        const courses = await response.json();

        const list = document.getElementById("courseList");
        list.innerHTML = "";

        courses.forEach((course) => {
            let li = document.createElement("li");
            li.innerHTML = `${course.name} - ${course.description} 
                <button class='delete-btn' onclick='deleteCourse(${course.id})'>Delete</button>`;
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}

// 🟢 Function to Add a New Course (Saves to Database)
async function addCourse() {
    let name = document.getElementById("courseName").value;
    let desc = document.getElementById("courseDescription").value;

    if (!name || !desc) {
        alert("Please fill in both fields!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/admin/add-course", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                description: desc,
            }),
        });

        if (response.ok) {
            alert("Course added successfully!");
            fetchCourses(); // Refresh the course list
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to add course.");
    }

    document.getElementById("courseName").value = "";
    document.getElementById("courseDescription").value = "";
}

// 🟢 Function to Delete a Course from Database
async function deleteCourse(courseId) {
    try {
        const response = await fetch(`http://localhost:5000/admin/delete-course/${courseId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Course deleted successfully!");
            fetchCourses(); // Refresh the course list
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete course.");
    }
}

// 🟢 Function to Fetch and Display Students from Backend
async function fetchStudents() {
    try {
        const response = await fetch("http://localhost:5000/admin/students");
        const students = await response.json();

        const list = document.getElementById("studentList");
        list.innerHTML = "";

        students.forEach((student) => {
            let li = document.createElement("li");
            li.innerHTML = `${student.name} (ID: ${student.id}) - ${student.email} - Courses: ${student.enrolled_courses || 'None'} - Grades: ${student.grades || 'N/A'} 
                <button class='delete-btn' onclick='deleteStudent(${student.id})'>Delete</button>`;
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

// 🟢 Function to Add a New Student (Saves to Database)
async function addStudent() {
    let name = document.getElementById("studentName").value;
    let id = document.getElementById("studentID").value;
    let email = document.getElementById("studentEmail").value;

    if (!name || !id || !email) {
        alert("Please fill in all required fields!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/admin/add-student", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                student_id: id,
            }),
        });

        if (response.ok) {
            alert("Student added successfully!");
            fetchStudents(); // Refresh the student list
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to add student.");
    }

    document.getElementById("studentName").value = "";
    document.getElementById("studentID").value = "";
    document.getElementById("studentEmail").value = "";
}

// 🟢 Function to Delete a Student from Database
async function deleteStudent(studentId) {
    try {
        const response = await fetch(`http://localhost:5000/admin/delete-student/${studentId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Student deleted successfully!");
            fetchStudents(); // Refresh the student list
        } else {
            const data = await response.json();
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete student.");
    }
}
