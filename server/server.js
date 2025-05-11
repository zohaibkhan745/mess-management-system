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

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
