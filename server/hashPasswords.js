const bcrypt = require('bcrypt');
const db = require('./db'); // Adjust the path to match your database connection file

(async () => {
  try {
    // Query all users
    const [users] = await db.query('SELECT * FROM users');
    
    for (const user of users) {
      if (!user.password.startsWith('$2b$')) { // Check if the password is already hashed
        // Hash the plain-text password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        // Update the user's password in the database
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
        console.log(`Password for user ${user.username} has been hashed`);
      }
    }

    console.log('All passwords have been updated.');
    process.exit(0); // Exit the script
  } catch (err) {
    console.error('Error updating passwords:', err);
    process.exit(1); // Exit with failure
  }
})();
