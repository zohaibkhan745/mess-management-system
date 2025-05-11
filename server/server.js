require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./database"); // Import the PostgreSQL pool from database.js
const app = express();
const port = 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// User Registration endpoint
app.post("/adduser", async (req, res) => {
  console.log("Request body:", req.body);

  // Try accessing the fields differently
  const name = req.body.name;
  const regNumber = req.body.regNumber;
  const email = req.body.email;
  const password = req.body.password;

  console.log("Fields:", { name, regNumber, email, password });

  if (!name || !regNumber || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query(
      "SELECT * FROM Students WHERE email = $1 OR reg_no = $2",
      [email, regNumber]
    );
    if (userCheck.rowCount > 0) {
      return res.status(400).json({
        message: "User with this email or registration number already exists.",
      });
    }

    // Insert new user into Students table
    const result = await pool.query(
      "INSERT INTO Students (reg_no, name, email, password, degree, hostel_id) VALUES ($1, $2, $3, $4, NULL, NULL) RETURNING reg_no, name, email",
      [regNumber, name, email, password]
    );

    // Return success
    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again." });
  }
});

// Signin endpoint - Updated to include profile_complete status
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", { email });

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Find user in Students table
    const query = "SELECT * FROM Students WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];

    // In a real application, you would compare hashed passwords
    if (user.password !== password) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create a simple token
    const token = Buffer.from(`${user.reg_no}:${user.email}`).toString(
      "base64"
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        regNo: user.reg_no,
        name: user.name,
        email: user.email,
        profileComplete: user.profile_complete || false,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again." });
  }
});

// Receptionist Signin endpoint
app.post("/receptionist/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log("Receptionist login attempt:", { email });

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Find receptionist in receptionists table
    const query = "SELECT * FROM receptionists WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const receptionist = result.rows[0];

    // In a real application, you would compare hashed passwords
    if (receptionist.password !== password) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create a simple token
    const token = Buffer.from(
      `${receptionist.id}:${receptionist.email}`
    ).toString("base64");

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: receptionist.id,
        name: receptionist.name,
        email: receptionist.email,
        role: "receptionist",
      },
    });
  } catch (err) {
    console.error("Error during receptionist login:", err);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again." });
  }
});

// Feedback submission endpoint
app.post("/api/feedback", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required." });
  }

  try {
    // Using PostgreSQL parameterized query with $1, $2 syntax
    const query =
      "INSERT INTO feedback (email, message) VALUES ($1, $2) RETURNING *";
    const result = await pool.query(query, [email, message]);

    res.status(201).json({
      message: "Feedback submitted successfully.",
      feedback: result.rows[0],
    });
  } catch (err) {
    console.error("Error inserting feedback:", err);
    res.status(500).json({ error: "Failed to submit feedback." });
  }
});

// Get weekly menu
app.get("/menu", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT day, breakfast, lunch, dinner FROM meals_menu ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching menu:", err);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
});

// Get meals data for the receptionist dashboard
app.get("/api/meals", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM meals_menu ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching meals:", err);
    res.status(500).json({ message: "Failed to fetch meals data" });
  }
});

// Update a meal for a specific day
app.put("/api/meals/:day", async (req, res) => {
  const { day } = req.params;
  const { breakfast, lunch, dinner } = req.body;

  if (!breakfast || !lunch || !dinner) {
    return res.status(400).json({ message: "All meal fields are required" });
  }

  try {
    const result = await pool.query(
      "UPDATE meals_menu SET breakfast = $1, lunch = $2, dinner = $3 WHERE day = $4 RETURNING *",
      [breakfast, lunch, dinner, day]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `No menu found for ${day}` });
    }

    res.json({
      message: `Menu for ${day} updated successfully`,
      meal: result.rows[0],
    });
  } catch (err) {
    console.error(`Error updating meal for ${day}:`, err);
    res.status(500).json({ message: "Failed to update meal" });
  }
});

// Endpoint to complete user profile
app.post("/complete-profile", async (req, res) => {
  console.log("Complete profile request received:", req.body);
  const { regNo, degree, hostelName } = req.body;

  if (!regNo || !degree || !hostelName) {
    return res.status(400).json({
      message: "Registration number, degree, and hostel name are required.",
    });
  }

  try {
    // First, check if the department exists, if not create it
    let departmentId;
    const deptCheck = await pool.query(
      "SELECT department_id FROM degrees WHERE department_name = $1",
      [degree]
    );

    if (deptCheck.rowCount === 0) {
      // Department doesn't exist, create it
      const newDeptResult = await pool.query(
        "INSERT INTO degrees (department_name) VALUES ($1) RETURNING department_id",
        [degree]
      );
      departmentId = newDeptResult.rows[0].department_id;
      console.log("Created new department:", degree, "with ID:", departmentId);
    } else {
      departmentId = deptCheck.rows[0].department_id;
      console.log(
        "Found existing department:",
        degree,
        "with ID:",
        departmentId
      );
    }

    // Next, check if the hostel exists, if not create it
    let hostelId;
    const hostelCheck = await pool.query(
      "SELECT hostel_id FROM hostels WHERE hostel_name = $1", // Note: using lowercase table name
      [hostelName]
    );

    if (hostelCheck.rowCount === 0) {
      // Hostel doesn't exist, create it
      const newHostelResult = await pool.query(
        "INSERT INTO hostels (hostel_name) VALUES ($1) RETURNING hostel_id", // Note: using lowercase table name
        [hostelName]
      );
      hostelId = newHostelResult.rows[0].hostel_id;
      console.log("Created new hostel:", hostelName, "with ID:", hostelId);
    } else {
      hostelId = hostelCheck.rows[0].hostel_id;
      console.log("Found existing hostel:", hostelName, "with ID:", hostelId);
    }

    // Update the student's profile
    console.log("Updating student profile with values:", {
      departmentId,
      hostelId,
      regNo,
    });

    const updateResult = await pool.query(
      "UPDATE students SET degree = $1, hostel_id = $2, profile_complete = TRUE WHERE reg_no = $3 RETURNING *", // Note: using lowercase table name
      [departmentId, hostelId, regNo]
    );

    console.log("Update result rows:", updateResult.rowCount);
    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const updatedUser = updateResult.rows[0];

    return res.status(200).json({
      message: "Profile completed successfully",
      user: {
        regNo: updatedUser.reg_no,
        name: updatedUser.name,
        email: updatedUser.email,
        degree,
        hostelName,
        profileComplete: true,
      },
    });
  } catch (err) {
    console.error("Error completing profile:", err);
    res.status(500).json({
      message: "Internal server error. Please try again.",
      error: err.message,
    });
  }
});

// Get all rules
app.get("/api/rules", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT rule_id, title, description, priority FROM rules ORDER BY priority ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching rules:", err);
    res.status(500).json({ message: "Failed to fetch rules" });
  }
});

// CRUD operations for Rules
// Add new rule
app.post("/api/rules", async (req, res) => {
  const { title, description, priority } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  try {
    // If priority is not provided, set it to the highest existing priority + 1
    let rulePriority = priority;
    if (!rulePriority) {
      const maxPriorityResult = await pool.query(
        "SELECT MAX(priority) FROM rules"
      );
      rulePriority = (maxPriorityResult.rows[0].max || 0) + 1;
    }

    const result = await pool.query(
      "INSERT INTO rules (title, description, priority) VALUES ($1, $2, $3) RETURNING *",
      [title, description, rulePriority]
    );

    res.status(201).json({
      message: "Rule added successfully",
      rule: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding rule:", err);
    res.status(500).json({ message: "Failed to add rule" });
  }
});

// Update existing rule
app.put("/api/rules/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, priority } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  try {
    const result = await pool.query(
      "UPDATE rules SET title = $1, description = $2, priority = $3 WHERE rule_id = $4 RETURNING *",
      [title, description, priority, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Rule not found" });
    }

    res.json({
      message: "Rule updated successfully",
      rule: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating rule:", err);
    res.status(500).json({ message: "Failed to update rule" });
  }
});

// Delete rule
app.delete("/api/rules/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM rules WHERE rule_id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Rule not found" });
    }

    res.json({
      message: "Rule deleted successfully",
      rule: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting rule:", err);
    res.status(500).json({ message: "Failed to delete rule" });
  }
});

// Get all FAQs
app.get("/api/faqs", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT faq_id, question, answer, is_featured FROM faqs ORDER BY is_featured DESC, faq_id ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching FAQs:", err);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
});

// CRUD operations for FAQs
// Add new FAQ
app.post("/api/faqs", async (req, res) => {
  const { question, answer, is_featured } = req.body;

  if (!question || !answer) {
    return res
      .status(400)
      .json({ message: "Question and answer are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO faqs (question, answer, is_featured) VALUES ($1, $2, $3) RETURNING *",
      [question, answer, is_featured || false]
    );

    res.status(201).json({
      message: "FAQ added successfully",
      faq: result.rows[0],
    });
  } catch (err) {
    console.error("Error adding FAQ:", err);
    res.status(500).json({ message: "Failed to add FAQ" });
  }
});

// Update existing FAQ
app.put("/api/faqs/:id", async (req, res) => {
  const { id } = req.params;
  const { question, answer, is_featured } = req.body;

  if (!question || !answer) {
    return res
      .status(400)
      .json({ message: "Question and answer are required" });
  }

  try {
    const result = await pool.query(
      "UPDATE faqs SET question = $1, answer = $2, is_featured = $3 WHERE faq_id = $4 RETURNING *",
      [question, answer, is_featured || false, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({
      message: "FAQ updated successfully",
      faq: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating FAQ:", err);
    res.status(500).json({ message: "Failed to update FAQ" });
  }
});

// Delete FAQ
app.delete("/api/faqs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM faqs WHERE faq_id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.json({
      message: "FAQ deleted successfully",
      faq: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting FAQ:", err);
    res.status(500).json({ message: "Failed to delete FAQ" });
  }
});

// Get attendance for a specific student
app.get("/api/attendance/:regNo", async (req, res) => {
  const { regNo } = req.params;
  const { month, year } = req.query;

  try {
    let query = "SELECT * FROM attendance WHERE reg_no = $1";
    const params = [regNo];

    if (month && year) {
      // Filter by specific month and year
      query +=
        " AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3";
      params.push(month, year);
    }

    query += " ORDER BY date DESC";

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
});

// Set/update attendance status for a student
app.post("/api/attendance", async (req, res) => {
  const { regNo, date, status } = req.body;

  // Check if the time is between 10 AM and 12 PM (restricted period)
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  if (currentHour >= 10 && currentHour < 12) {
    return res.status(403).json({
      message: "Attendance changes are not allowed between 10 AM and 12 PM",
    });
  }

  try {
    // Check if a record already exists for this student and date
    const checkResult = await pool.query(
      "SELECT * FROM attendance WHERE reg_no = $1 AND date = $2",
      [regNo, date]
    );

    let result;

    if (checkResult.rowCount > 0) {
      // Update existing record
      result = await pool.query(
        "UPDATE attendance SET status = $1 WHERE reg_no = $2 AND date = $3 RETURNING *",
        [status, regNo, date]
      );
    } else {
      // Insert new record
      result = await pool.query(
        "INSERT INTO attendance (reg_no, date, status) VALUES ($1, $2, $3) RETURNING *",
        [regNo, date, status]
      );
    }

    res.status(200).json({
      message: "Attendance recorded successfully",
      attendance: result.rows[0],
    });
  } catch (err) {
    console.error("Error recording attendance:", err);
    res.status(500).json({ message: "Failed to record attendance" });
  }
});

// Get summary of attendance for a student for the current month
app.get("/api/attendance/summary/:regNo", async (req, res) => {
  const { regNo } = req.params;
  const { month, year } = req.query;

  // Default to current month/year if not specified
  const currentDate = new Date();
  const currentMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
  const currentYear = year ? parseInt(year) : currentDate.getFullYear();

  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'in') as days_in,
        COUNT(*) FILTER (WHERE status = 'out') as days_out,
        COUNT(*) as total_records
      FROM attendance 
      WHERE reg_no = $1 
      AND EXTRACT(MONTH FROM date) = $2 
      AND EXTRACT(YEAR FROM date) = $3`,
      [regNo, currentMonth, currentYear]
    );

    // Calculate estimated bill (for example, 300 rupees per day for 'in' status)
    const daysIn = parseInt(result.rows[0].days_in) || 0;
    const estimatedBill = daysIn * 300; // 300 rupees per day

    res.json({
      daysIn,
      daysOut: parseInt(result.rows[0].days_out) || 0,
      totalRecords: parseInt(result.rows[0].total_records) || 0,
      estimatedBill,
      month: currentMonth,
      year: currentYear,
    });
  } catch (err) {
    console.error("Error fetching attendance summary:", err);
    res.status(500).json({ message: "Failed to fetch attendance summary" });
  }
});

// Get bill for a specific student
app.get("/api/bill/:regNo", async (req, res) => {
  const { regNo } = req.params;
  const { month, year } = req.query;

  // Default to current month/year if not specified
  const currentDate = new Date();
  const currentMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
  const currentYear = year ? parseInt(year) : currentDate.getFullYear();

  try {
    // Calculate the first and last day of the month
    const startDate = new Date(currentYear, currentMonth - 1, 1)
      .toISOString()
      .split("T")[0];
    const endDate = new Date(currentYear, currentMonth, 0)
      .toISOString()
      .split("T")[0];
    const totalDays = new Date(currentYear, currentMonth, 0).getDate();

    // Get the number of days the student was marked "in"
    const result = await pool.query(
      `SELECT COUNT(*) as days_in 
       FROM attendance 
       WHERE reg_no = $1 AND date BETWEEN $2 AND $3 AND status = 'in'`,
      [regNo, startDate, endDate]
    );

    const daysIn = parseInt(result.rows[0].days_in) || 0;
    const totalBill = daysIn * 500; // Rs. 500 per day

    // For demo purposes - consider a bill paid if it's from a previous month
    const isPaidMonth =
      currentYear < currentDate.getFullYear() ||
      (currentYear === currentDate.getFullYear() &&
        currentMonth < currentDate.getMonth() + 1);

    res.json({
      regNo,
      month: currentMonth,
      year: currentYear,
      daysIn,
      totalDays,
      totalBill,
      isPaid: isPaidMonth,
      generatedOn: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error calculating bill:", err);
    res.status(500).json({ message: "Failed to calculate bill" });
  }
});

// Get bill history for a student
app.get("/api/bill/history/:regNo", async (req, res) => {
  const { regNo } = req.params;

  try {
    // Get a list of unique months that have attendance records
    const monthsQuery = await pool.query(
      `SELECT DISTINCT 
        EXTRACT(YEAR FROM date) as year,
        EXTRACT(MONTH FROM date) as month
       FROM attendance 
       WHERE reg_no = $1 
       ORDER BY year DESC, month DESC`,
      [regNo]
    );

    const months = monthsQuery.rows;
    const billHistory = [];

    // For each month, calculate the bill
    for (const monthData of months) {
      const year = parseInt(monthData.year);
      const month = parseInt(monthData.month);

      const startDate = new Date(year, month - 1, 1)
        .toISOString()
        .split("T")[0];
      const endDate = new Date(year, month, 0).toISOString().split("T")[0];

      const result = await pool.query(
        `SELECT COUNT(*) as days_in 
         FROM attendance 
         WHERE reg_no = $1 AND date BETWEEN $2 AND $3 AND status = 'in'`,
        [regNo, startDate, endDate]
      );

      const daysIn = parseInt(result.rows[0].days_in) || 0;
      const totalBill = daysIn * 500;

      // Consider bills from previous months as paid
      const currentDate = new Date();
      const isPaidMonth =
        year < currentDate.getFullYear() ||
        (year === currentDate.getFullYear() &&
          month < currentDate.getMonth() + 1);

      billHistory.push({
        month,
        year,
        daysIn,
        totalBill,
        isPaid: isPaidMonth,
      });
    }

    res.json(billHistory);
  } catch (err) {
    console.error("Error fetching bill history:", err);
    res.status(500).json({ message: "Failed to fetch bill history" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
