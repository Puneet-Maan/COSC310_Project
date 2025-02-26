document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5000/api/courses"; // references APIR URL (fetch course data from backend)
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

    let courses = []; //store courses fetched from backend
    let filteredCourses = []; //store courses after filtering
    let currentPage = 1; //track current page
    const itemsPerPage = 10; //number of courses per page

    // Fetch courses from backend
    async function fetchCourses() {
        try {
            const response = await fetch(API_URL); //to retrieve courses from backend 
            if (!response.ok) throw new Error("Failed to fetch courses");
            courses = await response.json(); //parse the response into a javascript object
            filteredCourses = [...courses]; // Copy courses for filtering
            renderCourses(); //to display courses on the page
        } catch (error) {
            console.error("Error fetching courses:", error);
            courseTableBody.innerHTML = "<tr><td colspan='3'>Failed to load courses.</td></tr>";
        }
    }

    // Render paginated courses
    function renderCourses() {
        courseTableBody.innerHTML = ""; //clear previous course list 
        const start = (currentPage - 1) * itemsPerPage; //calculate start index
        const end = start + itemsPerPage; //calculate end index
        const paginatedCourses = filteredCourses.slice(start, end); //extract 10 courses from filteredCourses

        //loop through paginated courses and display them in the table
        paginatedCourses.forEach(course => {
            const row = document.createElement("tr"); //create a <tr> table row
            row.innerHTML = `
                <td>
                    <a href="course-details.html?code=${course.course_code}" class="course-link">
                    ${course.course_code}
                    </a>
                </td>
                <td>${course.course_name}</td>
                <td>${course.department}</td>
            `;
            courseTableBody.appendChild(row); //append the row to the table body
        });

        // Update page number
        const totalPages = Math.ceil(filteredCourses.length / itemsPerPage); //calculate total number of pages
        pageNumberSpan.textContent = `Page ${currentPage} of ${totalPages}`; //display current page number

        // Enable/Disable pagination buttons
        prevButton.disabled = currentPage === 1; 
        nextButton.disabled = currentPage === totalPages;
        firstButton.disabled = currentPage === 1;
        lastButton.disabled = currentPage === totalPages;
    }

    // Search and filter courses
    function filterCourses() {
        const searchText = searchBar.value.toLowerCase(); 
        const selectedDepartment = filterByDepartment.value;  //get selected department from dropdown

        filteredCourses = courses.filter(course => 
            (course.course_name.toLowerCase().includes(searchText) || 
             course.course_code.toLowerCase().includes(searchText)) &&
            (selectedDepartment === "" || course.department === selectedDepartment)
        );

        sortCourses(); // ensures sorted results are displayed
        currentPage = 1; // Reset to first page after filtering
        renderCourses(); //update the displayed courses
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

    // Clear search and reset filters
    clearSearchButton.addEventListener("click", () => {
        searchBar.value = "";
        filterCourses();
    });

    // Previous page
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