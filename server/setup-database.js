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

    // Create meals_menu table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meals_menu (
        id SERIAL PRIMARY KEY,
        day VARCHAR(20) UNIQUE NOT NULL,
        breakfast VARCHAR(255) NOT NULL,
        lunch VARCHAR(255) NOT NULL,
        dinner VARCHAR(255) NOT NULL
      )
    `);
    console.log("meals_menu table created or already exists");

    // Insert weekly menu if not already present
    const menuRows = await pool.query("SELECT COUNT(*) FROM meals_menu");
    if (parseInt(menuRows.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO meals_menu (day, breakfast, lunch, dinner) VALUES
        ('Monday', 'Paratha, Tea', 'Chicken Curry, Rice', 'Lentils, Chapati'),
        ('Tuesday', 'Bread, Egg, Tea', 'Daal, Roti', 'Mixed Vegetables'),
        ('Wednesday', 'Paratha, Yogurt, Tea', 'Chicken Biryani', 'Aloo (Potato) Curry'),
        ('Thursday', 'Omelet, Tea', 'Chana (Chickpeas), Rice', 'Chicken Karahi'),
        ('Friday', 'Bread, Jam, Tea', 'Vegetable Pulao', 'Daal, Chapati'),
        ('Saturday', 'Paratha, Tea', 'Chicken Qorma, Roti', 'Mix Sabzi (Vegetables)'),
        ('Sunday', 'Halwa Puri, Tea', 'Beef Curry, Rice', 'Chicken Handi')
      `);
      console.log("Inserted weekly menu into meals_menu table");
    }

    console.log("Database setup complete!");
  } catch (error) {
    console.error("Database setup error:", error);
  } finally {
    // Close the pool
    pool.end();
  }
}

setupDatabase();
