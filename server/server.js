const express = require('express');
const cors = require('cors');

const app = express();

const pool = require('./database.js')

app.use(express.json());
app.use(cors());

app.post("/adduser", async (req, res) => {
    const { fname, lname, email, password } = req.body;

    // Backend validation
    if (!fname || !lname || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if the email already exists
        const checkQuery = `SELECT * FROM students_accounts_info WHERE email = $1`;
        const checkResult = await pool.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            // Email already exists
            return res.status(409).json({ message: "User already exists. Please try logging in." });
        }

        // Insert the new user
        const insertQuery = `INSERT INTO students_accounts_info (fname, lname, email, password) VALUES ($1, $2, $3, $4)`;
        const values = [fname, lname, email, password];
        await pool.query(insertQuery);

        res.status(201).json({ message: "User added successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = `SELECT * FROM students_accounts_info WHERE email = $1 AND password = $2`;
        const values = [email, password];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            // User exists
            res.status(200).json({ message: "Sign-in successful", user: result.rows[0] });
        } else {
            // User does not exist or password is incorrect
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(4000, () => console.log('Server is running on port 4000'));