document.addEventListener("DOMContentLoaded", async () => { // wait until HTML is fully loaded before executing script and ensures all elements are available before modifying them
    const API_URL = "http://localhost:5000/api/courses"; //backend api url

    
    const urlParams = new URLSearchParams(window.location.search); //extracts query parameters from the url
    const courseCode = urlParams.get("code"); //retrieves value of code parameter 

    
    if (!courseCode) {
        document.getElementById("course-info").innerHTML = "<p>Invalid Course</p>";
        return;
    }

    //fetch course details from backend
    try {
        const response = await fetch(`${API_URL}/${courseCode}`); //sends GET reuest 
        if (!response.ok) throw new Error("Course not found"); 

        //convert api response to json
        const course = await response.json(); //parses api into javascript object course

        // Update page content
        document.getElementById("course-title").textContent = course.course_name;
        document.getElementById("course-code").textContent = course.course_code;
        document.getElementById("course-department").textContent = course.department;
        document.getElementById("course-credits").textContent = course.credits;
        document.getElementById("course-lab").textContent = course.requires_lab ? "Yes" : "No";
        document.getElementById("course-instructor").textContent = course.instructor || "TBA";
        document.getElementById("course-schedule").textContent = course.schedule || "TBA";

        //handle course registration
        document.getElementById("register-btn").addEventListener("click", () => { //event listener to the register button
            alert(`You have registered for ${course.course_name}`); //alert box to confirm registration
        });
    } catch (error) { //to preven the page from crashing if an error occurs
        console.error("Error fetching course details:", error);
        document.getElementById("course-info").innerHTML = "<p>Course details could not be retrieved.</p>";
    }
});