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
  const { fname, lname, email, password } = req.body;

  if (!fname || !lname || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query(
      "SELECT * FROM students_accounts_info WHERE email = $1",
      [email]
    );
    if (userCheck.rowCount > 0) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }


    // Insert new user
    const result = await pool.query(
      "INSERT INTO students_accounts_info (fname, lname, email, password) VALUES ($1, $2, $3, $4) RETURNING id, fname, lname, email",
      [fname, lname, email, password]
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

// Keep the signup endpoint for backward compatibility
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  let fname = name;
  let lname = "";

  // Split name into first and last name if it contains a space
  if (name && name.includes(" ")) {
    const nameParts = name.split(" ");
    fname = nameParts[0];
    lname = nameParts.slice(1).join(" ");
  }


  if (!fname || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query(
      "SELECT * FROM students_accounts_info WHERE email = $1",
      [email]
    );
    if (userCheck.rowCount > 0) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Insert new user
    const result = await pool.query(
      "INSERT INTO students_accounts_info (fname, lname, email, password) VALUES ($1, $2, $3, $4) RETURNING id, fname, lname, email",
      [fname, lname, email, password]
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

// Signin endpoint
app.post("/signin", async (req, res) => {

  const { email, password } = req.body;
  console.log("Login attempt:", { email });

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Query to check if the user exists with the provided credentials
    const query = "SELECT * FROM students_accounts_info WHERE email = $1";
    const result = await pool.query(query, [email]);
    console.log("Query result:", { rowCount: result.rowCount });

    // Check if user exists
    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];
    console.log("User found:", { id: user.id, email: user.email });

    // In a real application, you would compare hashed passwords
    // For this example, we're assuming the passwords are stored in plain text
    if (user.password !== password) {
      console.log("Password mismatch");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create a simple token (in a real app, use JWT)
    const token = Buffer.from(`${user.id}:${user.email}`).toString("base64");

    // Return success with token
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: `${user.fname} ${user.lname}`.trim(),
        email: user.email,
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
