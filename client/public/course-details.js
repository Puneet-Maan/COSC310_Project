document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "http://localhost:5000/api"; // Backend API base URL

  const urlParams = new URLSearchParams(window.location.search);
  const courseCode = urlParams.get("code");

  if (!courseCode) {
    document.getElementById("course-info").innerHTML = "<p>Invalid Course</p>";
    return;
  }

  try {
    // Fetch course details
    const response = await fetch(`${API_URL}/courses/${courseCode}`);
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

    // Ensure course_id is part of the course object
    const courseId = course.course_id;
    if (!courseId) {
      console.error("Course ID is missing from course details.");
      alert("Unable to register for this course. Please contact support.");
      return;
    }

    // Handle course registration
    document.getElementById("register-btn").addEventListener("click", async () => {
      const userEmail = localStorage.getItem("userEmail"); // Check if user is logged in
      if (!userEmail) {
        alert("You are not logged in. Please log in to register for a course.");
        return;
      }

      try {
        console.log("Using email to fetch account:", userEmail);
        
        // IMPORTANT: Use the account endpoint, not the students endpoint
        const accountResponse = await fetch(`${API_URL}/account?email=${userEmail}`);
        if (!accountResponse.ok) {
          console.error("Account fetch failed with status:", accountResponse.status);
          throw new Error("User account not found");
        }

        const responseText = await accountResponse.text();
        console.log("Raw account API response:", responseText);
        
        const account = JSON.parse(responseText);
        console.log("Account response:", account);
        
        // Get the user_id from the account object
        const userId = account.user_id;

        if (!userId) {
          console.error("User ID is undefined in account response:", account);
          alert("Unable to fetch your account details. Please contact support.");
          return;
        }

        console.log("User ID fetched:", userId); // Log user ID
        console.log("Course Code fetched:", courseCode); // Log course code

        // Register the student for the course using user_id as student_id
        const registerResponse = await fetch(`${API_URL}/register-student`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: userId, course_code: courseCode }),
        });

        if (!registerResponse.ok) {
          const errorData = await registerResponse.json();
          console.error("Registration failed:", errorData); // Log error response
          throw new Error(errorData.message || "Failed to register for the course");
        }

        alert(`You have successfully registered for ${course.course_name}`);
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred while registering for the course. Please try again.");
      }
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    document.getElementById("course-info").innerHTML = "<p>Course details could not be retrieved.</p>";
  }
});