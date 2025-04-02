<div align="center">
  <img src="https://github.com/user-attachments/assets/77607944-b3bb-4813-8c70-43efa5d501f2" alt="title">
   <p>Created by Tolu Akinwande, Harper Kerstens, Puneet Maan, Mika Panagsagan, and Jeel Patel.</p>
</div>

### Student Perspective
https://github.com/user-attachments/assets/81bb1362-4be1-41dd-930e-d2d3c733ea56

### Admin Perspective
https://github.com/user-attachments/assets/beabf4cc-eea9-4f51-98b0-36c6211230fc

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

5. Follow the manual setup steps described in the "Docker Setup for Full Deployment" section if needed.

### Running Tests

![tests](https://github.com/user-attachments/assets/414b7ef7-839b-4efa-b4ee-5c67300f4424)

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

