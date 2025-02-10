//placeholder
// Sample Course Data (Replace with actual API call later)
const courses=[
    { code: "BIOL", title: "Biology", faculty: "Faculty of Science" },
    { code: "CHEM", title: "Chemistry", faculty: "Faculty of Science" },
    { code: "COSC", title: "Computer Science", faculty: "Faculty of Science" },
    { code: "DATA", title: "Data Science", faculty: "Faculty of Science" },
    { code: "MATH", title: "Mathematics", faculty: "Faculty of Science" },
    { code: "PHYS", title: "Physics", faculty: "Faculty of Science" },
    { code: "STAT", title: "Statistics", faculty: "Faculty of Science" },
    { code: "ENGG", title: "Engineering", faculty: "Faculty of Engineering" }
];

let currentPage=1;
const rowsPerPage=4; // Number of courses per page

//function to display courses

function displayCourses(filteredCoursees=courses,page=1){
    const tableBody = document.querySelector(".course-table tbody");
    tableBody.innerHTML = ""; // Clear previous courses

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedCourses = filteredCourses.slice(start, end);

    paginatedCourses.forEach((course) => {
        const row = `<tr>
            <td><a href="#">${course.code}</a></td>
            <td>${course.title}</td>
            <td>${course.faculty}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    updatePaginationButtons(filteredCourses.length);

}

// Function to Filter Courses by Search
document.getElementById("searchBar").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const filteredCourses = courses.filter(course =>
        course.code.toLowerCase().includes(searchValue) ||
        course.title.toLowerCase().includes(searchValue) ||
        course.faculty.toLowerCase().includes(searchValue)
    );
    currentPage = 1; // Reset to first page after filtering
    displayCourses(filteredCourses, currentPage);
});

// Function to Filter by Department
document.getElementById("filterByDepartment").addEventListener("change", function () {
    const selectedDepartment = this.value;
    const filteredCourses = selectedDepartment
        ? courses.filter(course => course.faculty === selectedDepartment)
        : courses;
    
    currentPage = 1; // Reset to first page after filtering
    displayCourses(filteredCourses, currentPage);
});

// Pagination Controls
document.querySelector(".pagination").addEventListener("click", function (event) {
    if (event.target.tagName === "BUTTON") {
        if (event.target.textContent === "Next" && currentPage * rowsPerPage < courses.length) {
            currentPage++;
        } else if (event.target.textContent === "Previous" && currentPage > 1) {
            currentPage--;
        }
        displayCourses(courses, currentPage);
    }
});

// Function to Update Pagination Buttons
function updatePaginationButtons(totalCourses) {
    document.querySelector(".pagination button:first-child").disabled = currentPage === 1;
    document.querySelector(".pagination button:last-child").disabled = currentPage * rowsPerPage >= totalCourses;
}

// Initialize Course Display on Page Load
window.onload = () => {
    displayCourses();
};