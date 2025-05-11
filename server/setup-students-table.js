const pool = require("./database");

async function setupTables() {
  try {
    // Create Degrees table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS degrees (
        department_id SERIAL PRIMARY KEY,
        department_name VARCHAR(100) UNIQUE NOT NULL
      )
    `);
    console.log("Degrees table created or already exists");
    
    // Create Hostels table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Hostels (
        hostel_id SERIAL PRIMARY KEY,
        hostel_name VARCHAR(100) UNIQUE NOT NULL
      )
    `);
    console.log("Hostels table created or already exists");

    // Create or update Students table (modify the degree field to be an INT for foreign key)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Students (
        reg_no VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        degree INT,
        hostel_id INT,
        profile_complete BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (degree) REFERENCES degrees(department_id),
        FOREIGN KEY (hostel_id) REFERENCES Hostels(hostel_id)
      )
    `);
    console.log("Students table created or already exists");

    console.log("Database setup complete!");
  } catch (error) {
    console.error("Database setup error:", error);
  } finally {
    // Close the pool
    pool.end();
  }
}

setupTables();