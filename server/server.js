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
      return res
        .status(400)
        .json({ message: "User with this email or registration number already exists." });
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
    const token = Buffer.from(`${user.reg_no}:${user.email}`).toString("base64");
    
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        regNo: user.reg_no,
        name: user.name,
        email: user.email,
        profileComplete: user.profile_complete || false
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
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

// Endpoint to complete user profile
app.post("/complete-profile", async (req, res) => {
  console.log("Complete profile request received:", req.body);
  const { regNo, degree, hostelName } = req.body;
  
  if (!regNo || !degree || !hostelName) {
    return res.status(400).json({ message: "Registration number, degree, and hostel name are required." });
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
      console.log("Found existing department:", degree, "with ID:", departmentId);
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
      regNo
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
        profileComplete: true
      }
    });
  } catch (err) {
    console.error("Error completing profile:", err);
    res.status(500).json({ 
      message: "Internal server error. Please try again.",
      error: err.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
