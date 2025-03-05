describe('Student Management', () => {
    let studentList, studentName, studentEmail, enrolledCourses, deleteButton;
    
   // Runs this block before each test to reset the test environment
   beforeEach(() => {
        document.body.innerHTML = `
            <select id="studentList">
                <option value="">-- Select a student --</option>
                <option value="1" data-name="John Doe" data-email="john@example.com" data-courses="CS101, Math102">John Doe</option>
                <option value="2" data-name="Jane Smith" data-email="jane@example.com" data-courses="CS101, Physics201">Jane Smith</option>
            </select>
            <input type="text" id="studentName" readonly>
            <input type="text" id="studentEmail" readonly>
            <input type="text" id="enrolledCourses" readonly>
            <button id="deleteButton">Delete Student</button>
        `;

        studentList = document.getElementById("studentList");
        studentName = document.getElementById("studentName");
        studentEmail = document.getElementById("studentEmail");
        enrolledCourses = document.getElementById("enrolledCourses");
        deleteButton = document.getElementById("deleteButton");
    });

    test('should populate student info when selected', () => {
        studentList.value = "1";
        studentList.dispatchEvent(new Event("change"));
        
        expect(studentName.value).toBe("John Doe");
        expect(studentEmail.value).toBe("john@example.com");
        expect(enrolledCourses.value).toBe("CS101, Math102");
    });

    test('should alert if trying to delete without selecting a student', () => {
        window.alert = jest.fn();
        deleteButton.click();
        expect(window.alert).toHaveBeenCalledWith("Please select a student first.");
    });

    test('should confirm deletion when a student is selected', () => {
        window.confirm = jest.fn(() => true);
        window.alert = jest.fn();
        
        studentList.value = "2";
        studentList.dispatchEvent(new Event("change"));
        deleteButton.click();
        
        expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete Jane Smith? This action may result in data loss.");
        expect(window.alert).toHaveBeenCalledWith("Jane Smith has been deleted.");
    });

    test('should not delete if deletion is cancelled', () => {
        window.confirm = jest.fn(() => false);
        window.alert = jest.fn();
        
        studentList.value = "2";
        studentList.dispatchEvent(new Event("change"));
        deleteButton.click();
        
        expect(window.confirm).toHaveBeenCalled();
        expect(window.alert).not.toHaveBeenCalledWith("Jane Smith has been deleted.");
    });
});
