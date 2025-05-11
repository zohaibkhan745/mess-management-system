const pool = require("./database");

async function seedAttendanceData() {
  try {
    // Get all students
    const studentsResult = await pool.query("SELECT reg_no FROM students");
    const students = studentsResult.rows;
    
    if (students.length === 0) {
      console.log("No students found in the database");
      return;
    }
    
    console.log(`Found ${students.length} students. Seeding attendance data...`);
    
    // Seed data for May 1 to May 11, 2023
    const startDate = new Date(2023, 4, 1); // May 1, 2023 (months are 0-based)
    const endDate = new Date(2023, 4, 11);  // May 11, 2023
    
    for (const student of students) {
      console.log(`Seeding attendance for student ${student.reg_no}`);
      
      // For each day in the date range
      for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
        const dateStr = day.toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Randomly assign 'in' or 'out' status
        const status = Math.random() > 0.3 ? 'in' : 'out'; // 70% chance of being 'in'
        
        try {
          // Check if an entry already exists
          const existingEntry = await pool.query(
            "SELECT * FROM attendance WHERE reg_no = $1 AND date = $2",
            [student.reg_no, dateStr]
          );
          
          if (existingEntry.rowCount === 0) {
            // Insert new entry
            await pool.query(
              "INSERT INTO attendance (reg_no, date, status) VALUES ($1, $2, $3)",
              [student.reg_no, dateStr, status]
            );
          }
        } catch (err) {
          console.error(`Error for student ${student.reg_no} on date ${dateStr}:`, err);
        }
      }
    }
    
    console.log("Attendance data seeding complete!");
  } catch (error) {
    console.error("Error seeding attendance data:", error);
  } finally {
    pool.end();
  }
}

seedAttendanceData();