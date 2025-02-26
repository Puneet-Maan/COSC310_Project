document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "http://localhost:5000/api/courses"; 

    // Get course code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseCode = urlParams.get("code");

    if (!courseCode) {
        document.getElementById("course-info").innerHTML = "<p>Invalid Course</p>";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${courseCode}`);
        if (!response.ok) throw new Error("Course not found");

        const course = await response.json();

        // Update page content
        document.getElementById("course-title").textContent = course.course_name;
        document.getElementById("course-code").textContent = course.course_code;
        document.getElementById("course-department").textContent = course.department;
        document.getElementById("course-credits").textContent = course.credits;
        document.getElementById("course-lab").textContent = course.requires_lab ? "Yes" : "No";
        document.getElementById("course-instructor").textContent = course.instructor || "TBA";
        document.getElementById("course-schedule").textContent = course.schedule || "TBA";

        document.getElementById("register-btn").addEventListener("click", () => {
            alert(`You have registered for ${course.course_name}`);
        });
    } catch (error) {
        console.error("Error fetching course details:", error);
        document.getElementById("course-info").innerHTML = "<p>Course details could not be retrieved.</p>";
    }
});