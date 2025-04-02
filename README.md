<div align="center">
  <img src="https://github.com/user-attachments/assets/77607944-b3bb-4813-8c70-43efa5d501f2" alt="title">
   <p>Created by Tolu Akinwande, Harper Kerstens, Puneet Maan, Mika Panagsagan, and Jeel Patel.</p>
</div>

### Student Perspective
https://github.com/user-attachments/assets/0b1c837f-fd6a-435a-903e-43e83982e057



### Admin Perspective
https://github.com/user-attachments/assets/e5a63c21-69ed-4ab8-9352-2c357acaba9e



### Functional Requirements
 - [x] Administator Login / Logout
 - [x] Manage Student Profiles
 - [x] Assign Students to a Course
 - [x] Generate Student Reports
 - [x] Search and Filter Students
 - [x] Create and Manage Courses
 - [x] Student Login / Logout
 - [x] Enroll in Courses
 - [x] View and Update Profile
 - [x] Waitlist Enrollment

## How to Run the Project
### Running the Backend

1. Open a terminal and navigate to the `server` folder:

   ```bash
   cd server
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the backend server in development mode:

   ```bash
   npm start
   ```

### Running the Frontend

1. Open a **new terminal** (keep the backend terminal running) and navigate to the `client` folder:

   ```bash
   cd client
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the frontend application:

   ```bash
   npm start
   ```

   `npm start` will automatically open the application in your default web browser. If it doesn't, you can manually navigate to `http://localhost:3001`. 

### Running the Database

1. Ensure that the Docker Desktop application is running.
2. Open a terminal in the `server` folder.
3. Start the database container using Docker:

   ```bash
   docker compose up -d
   ```

4. To access the database, run the following command:

   ```bash
   docker exec -it nullPointers-db mysql -u root -p
   ```

   - When prompted for a password, enter: `root`.

5. Once in the docker container, create the database:

   ```sql
   CREATE DATABASE IF NOT EXISTS nullPointersDatabase;
   ```

6. After creating the database ensure you are using the database before copying the .ddl file into the terminal:
   
      ```sql
      USE nullPointersDatabase;
      ```
7. Copy the contents of the `ddl\createDatabase.sql` file and paste it into the terminal to create the tables and populate them with data.

### Logging In

  1. Ensure the passwords from the database are hashed:
    Navigate to the server folder in your terminal (previous steps explain process) and run the following

   ```bash
   node hashPasswords.js
   ```

  2. Once succesfully ran the admin login is
       Username: admin1
       Password: adminpass

  3. Student Login
     You can succesfully create your own account to view from student perspective but if not the following logins work
     
        ```bash
       (John Doe)
     Username: student1
     Password: password123
        
      (Jane Doe)
     Username: student2
     Password: mypassword
     ```

  
### Running Tests

![testsPassing](https://github.com/user-attachments/assets/98b25e93-1c71-4e92-8d36-71393e0bb3b1)


Currently all tests are up to date and passing successfully.

#### How to run tests
1. Open a terminal in the `server` folder. Ensure the backend server is **not running**, as tests will fail otherwise:

   ```bash
   cd server
   ```

2. Verify that all dependencies are installed:

   ```bash
   npm install
   ```

3. Run the tests:

   ```bash
   npm test
   ```

   - This will execute all test files located in the `test` folder.

---

## Key Notes

- **Client Folder**: Contains the frontend code.
  - Pages are located in the `src` folder, with `.css` files for styling and `.js` files for functionality.
  - The `App.js` file includes an example of how to connect to a backend API.

- **Server Folder**: Contains the backend code.
  - The `ddl` folder includes `.sql` files to create and populate the database.
  - The `index.js` file serves as the main entry point for the backend.
  - New API routes should be added as `.js` files in the `routes` folder.

---

