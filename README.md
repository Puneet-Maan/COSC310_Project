# University of NullPointers

## How to Run the Project

### To run backend

1. Open terminal, navigate to the server folder:

   ```bash
   cd server
   ```
2. Install dependencies

   ```bash
   npm install
   ```
   
3. In terminal, run:

   ```bash
   npm run dev
   ```

### To run frontend

1. Open a NEW terminal while keeping the previous one active and navigate to the client folder:

   ```bash
   cd client
   ```

2. Install dependencies

   
   ```bash
   npm install
   ```

3. In terminal, run:

   ```bash
   npm start
   ```

### To run database

1. Make sure the Docker Desktop app is running.
2. Open terminal in the server folder.
3. Run:

   ```bash
   docker compose up -d
   ```

Once the Docker container is created and running, to access the database, run the following:

```bash
docker exec -it nullPointers-db mysql -u root -p
```

(It will prompt for a password, the answer is: `root`)

### How to Run Tests

1. Open terminal in the server folder (Make sure backend is not running or tests will fail):

   ```bash
   cd server
   ```

2. Make sure dependencies are installed:

   ```bash
   npm install
   ```

3. Once packages are installed, run the tests:

   ```bash
   npm test
   ```

   This will run all tests for all test files in the test folder.

## Key Notes

- **Client folder** is the front end.
- Pages are created in the `src` folder (both `.css` for style and `.js` for functionality).
- `App.js` is set up with an example of how to connect to an API on the backend.
- **Server folder** is the back end.
- `ddl` folder has `.sql` file to create the database (everyone will have to run this to populate their database once completed).
- `index.js` is the main file that is run, it will serve as the connection for all `.js` created in the backend.
- New API (`.js` files) should be created in the `routes` folder.
