document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000/api/courses"; // Backend API
    const courseTableBody = document.querySelector(".course-table tbody");
    const searchBar = document.getElementById("searchBar");
    const filterByDepartment = document.getElementById("filterByDepartment");
    const prevButton = document.querySelector(".pagination button:first-child");
    const nextButton = document.querySelector(".pagination button:last-child");

    let courses = [];
    let filteredCourses = [];
    let currentPage = 1;
    const itemsPerPage = 10;

    // Fetch courses from backend
    async function fetchCourses() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch courses");
            courses = await response.json();
            filteredCourses = [...courses]; // Copy courses for filtering
            renderCourses();
        } catch (error) {
            console.error("Error fetching courses:", error);
            courseTableBody.innerHTML = "<tr><td colspan='3'>Failed to load courses.</td></tr>";
        }
    }

    // Render paginated courses
    function renderCourses() {
        courseTableBody.innerHTML = "";
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedCourses = filteredCourses.slice(start, end);

        paginatedCourses.forEach(course => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><a href="#" class="course-link" data-code="${course.course_code}">${course.course_code}</a></td>
                <td>${course.course_name}</td>
                <td>${course.department}</td>
            `;
            courseTableBody.appendChild(row);
        });

        // Enable/Disable pagination buttons
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = end >= filteredCourses.length;

        attachCourseDetailsEvent(); // Attach click events for details
    }

    // Search and filter courses
    function filterCourses() {
        const searchText = searchBar.value.toLowerCase();
        const selectedDepartment = filterByDepartment.value;

        filteredCourses = courses.filter(course => 
            (course.course_name.toLowerCase().includes(searchText) || 
             course.course_code.toLowerCase().includes(searchText)) &&
            (selectedDepartment === "" || course.department === selectedDepartment)
        );

        currentPage = 1; // Reset to first page after filtering
        renderCourses();
    }

    // Display course details on click
    function attachCourseDetailsEvent() {
        document.querySelectorAll(".course-link").forEach(link => {
            link.addEventListener("click", async (event) => {
                event.preventDefault();
                const courseCode = event.target.dataset.code;
                showCourseDetails(courseCode);
            });
        });
    }

    async function showCourseDetails(courseCode) {
        try {
            const response = await fetch(`${API_URL}/${courseCode}`);
            if (!response.ok) throw new Error("Course not found");
            const course = await response.json();
            
            alert(`📘 Course Details:
            \n📌 Code: ${course.course_code}
            \n📖 Name: ${course.course_name}
            \n🏫 Department: ${course.department}
            \n📚 Credits: ${course.credits}
            \n🧪 Requires Lab: ${course.requires_lab ? "Yes" : "No"}`);
        } catch (error) {
            console.error("Error fetching course details:", error);
            alert("⚠ Course details could not be retrieved.");
        }
    }

    // Pagination controls
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderCourses();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage * itemsPerPage < filteredCourses.length) {
            currentPage++;
            renderCourses();
        }
    });

    displayPageNumber = () => {
        document.getElementsByClassName("pageNumber").innerText = currentPage;
        
    }

    // Attach event listeners for search and filtering
    searchBar.addEventListener("input", filterCourses);
    filterByDepartment.addEventListener("change", filterCourses);

    // Fetch courses on page load
    fetchCourses();
});