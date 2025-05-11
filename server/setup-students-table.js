const pool = require("./database");

async function setupStudentsTable() {
  try {
    // Create Hostels table if it doesn't exist (required for the foreign key)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Hostels (
        hostel_id SERIAL PRIMARY KEY,
        hostel_name VARCHAR(100) NOT NULL,
        location VARCHAR(100)
      )
    `);
    console.log("Hostels table created or already exists");

    // Create Students table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Students (
        reg_no VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        degree VARCHAR(50),
        hostel_id INT,
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

setupStudentsTable();