const pool = require("./database");

async function setupAttendanceTable() {
  try {
    console.log("Setting up attendance table...");

    // Create the attendance table with the correct constraints
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        reg_no VARCHAR(20) REFERENCES students(reg_no) ON DELETE CASCADE,
        date DATE NOT NULL,
        status VARCHAR(10) CHECK (status IN ('in', 'out')),
        UNIQUE (reg_no, date)
      )
    `);

    console.log("Attendance table created or already exists");

    // Check if the table has the correct structure
    const tableInfo = await pool.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE table_name = 'attendance'
    `);

    console.log("Attendance table schema:");
    tableInfo.rows.forEach((row) => {
      console.log(
        `  ${row.column_name}: ${row.data_type}${
          row.character_maximum_length
            ? `(${row.character_maximum_length})`
            : ""
        }`
      );
    });

    // Add an index to improve query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS attendance_reg_date_idx ON attendance(reg_no, date)
    `);

    console.log("Setup complete!");
  } catch (error) {
    console.error("Error setting up attendance table:", error);
  } finally {
    // Close the pool
    pool.end();
  }
}

setupAttendanceTable();
