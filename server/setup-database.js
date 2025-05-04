const pool = require("./database");

async function setupDatabase() {
  try {
    // First check if students_accounts_info table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'students_accounts_info'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      // Create students_accounts_info table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS students_accounts_info (
          id SERIAL PRIMARY KEY,
          fname VARCHAR(100) NOT NULL,
          lname VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log("students_accounts_info table created");

      // Add test users to students_accounts_info
      await pool.query(`
        INSERT INTO students_accounts_info (fname, lname, email, password) VALUES
        ('Test', 'User', 'test@example.com', 'password123'),
        ('Admin', 'User', 'admin@example.com', 'admin123')
      `);
      console.log("Added test users to students_accounts_info");
    } else {
      console.log("students_accounts_info table already exists");
    }

    // Check if users table exists and drop it if it does
    const usersTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);

    if (usersTableCheck.rows[0].exists) {
      await pool.query(`DROP TABLE IF EXISTS users CASCADE`);
      console.log("users table dropped");
    }

    // Create feedback table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Feedback table created or already exists");

    console.log("Database setup complete!");
  } catch (error) {
    console.error("Database setup error:", error);
  } finally {
    // Close the pool
    pool.end();
  }
}

setupDatabase();
