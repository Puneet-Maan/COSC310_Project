# University of NullPointers

## How to Run the Project

### Docker Setup for Full Deployment

1. Build the backend Docker image:

   ```bash
   cd server
   docker build -t server-image .
   ```

2. Build the frontend Docker image:

   ```bash
   cd client
   docker build -t client-image .
   ```

3. Navigate back to the root directory and start the application using Docker Compose:

   ```bash
   cd ..
   docker-compose up -d
   ```

4. Access the application in your browser at:

   [http://localhost:3000/](http://localhost:3000/)

   If the database is not working as expected, follow these steps to manually set it up:

   - Navigate to the `server` folder and start the database container:

     ```bash
     cd server
     docker compose up -d
     ```

   - Access the database container:

     ```bash
     docker exec -it nullPointers-db mysql -u root -p
     ```

     - When prompted for a password, enter: `root`.

   - Once inside the MySQL shell, switch to the database:

     ```sql
     USE nullPointersDatabase;
     ```

   - Open the `createDatabase.sql` file located in the `ddl` folder (in the root of the repository) and copy its contents. Paste the SQL commands into the MySQL shell to create the necessary tables.

   - Next, locate the `baseScript.sh` file in the `server` folder. Copy its contents and execute them in the terminal to populate the database with initial data.

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
   npm run dev
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

