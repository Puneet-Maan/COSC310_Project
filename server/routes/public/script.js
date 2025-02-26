document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000/api/courses"; // Backend API
    const courseTableBody = document.querySelector(".course-table tbody");
    const searchBar = document.getElementById("searchBar");
    const clearSearchButton = document.getElementById("clearSearch");
    const filterByDepartment = document.getElementById("filterByDepartment");
    const sortBy = document.getElementById("sortBy");
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    const firstButton = document.getElementById("firstPage");
    const lastButton = document.getElementById("lastPage");
    const pageNumberSpan = document.getElementById("pageNumber");

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
                <td>
                    <a href="course-details.html?code=${course.course_code}" class="course-link">
                    ${course.course_code}
                    </a>
                </td>
                <td>${course.course_name}</td>
                <td>${course.department}</td>
            `;
            courseTableBody.appendChild(row);
        });

        // Update page number
        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
        pageNumberSpan.textContent = `Page ${currentPage} of ${totalPages}`;

        // Enable/Disable pagination buttons
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
        firstButton.disabled = currentPage === 1;
        lastButton.disabled = currentPage === totalPages;
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

        sortCourses();
        currentPage = 1; // Reset to first page after filtering
        renderCourses();
    }

    // Sort courses
    function sortCourses() {
        const sortOption = sortBy.value;
        if (sortOption === "alphabet") {
            filteredCourses.sort((a, b) => a.course_name.localeCompare(b.course_name));
        } else if (sortOption === "year") {
            filteredCourses.sort((a, b) => {
                const yearA = parseInt(a.course_code.match(/\d+/)[0][0]);
                const yearB = parseInt(b.course_code.match(/\d+/)[0][0]);
                return yearA - yearB;
            });
        }
    }

    // Clear search
    clearSearchButton.addEventListener("click", () => {
        searchBar.value = "";
        filterCourses();
    });

    // Pagination controls
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderCourses();
        }
    });

    nextButton.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderCourses();
        }
    });

    firstButton.addEventListener("click", () => {
        currentPage = 1;
        renderCourses();
    });

    lastButton.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
        currentPage = totalPages;
        renderCourses();
    });

    searchBar.addEventListener("input", filterCourses);
    filterByDepartment.addEventListener("change", filterCourses);
    sortBy.addEventListener("change", () => {
        sortCourses();
        renderCourses();
    });

    fetchCourses(); // Initial fetch
});