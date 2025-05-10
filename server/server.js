const express = require('express');
const cors = require('cors');
const pool = require('./database.js');

const app = express();

app.use(express.json());
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

app.post("/adduser", async (req, res) => {
    const { fname, lname, email, password, role } = req.body;

    if (!fname || !lname || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Set default role to "student" if not provided
    const userRole = role || "student";

    try {
        const checkQuery = `SELECT * FROM students_accounts_info WHERE email = $1`;
        const checkResult = await pool.query(checkQuery, [email]);

        if (checkResult.rows.length > 0) {
            return res.status(409).json({ message: "User already exists. Please try logging in." });
        }

        const insertQuery = `INSERT INTO students_accounts_info (fname, lname, email, password, role) VALUES ($1, $2, $3, $4, $5)`;
        const values = [fname, lname, email, password, userRole];
        await pool.query(insertQuery, values);

        res.status(201).json({ message: "User added successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/signin", async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // If role is provided in the request, include it in the query
        let query, values;
        if (role) {
            query = `SELECT * FROM students_accounts_info WHERE email = $1 AND password = $2 AND role = $3`;
            values = [email, password, role];
        } else {
            query = `SELECT * FROM students_accounts_info WHERE email = $1 AND password = $2`;
            values = [email, password];
        }

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            // Include the user's role in the response
            const user = result.rows[0];
            res.status(200).json({
                message: "Sign-in successful",
                user: user
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Authentication middleware to protect routes based on user role
const authenticateRole = (requiredRole) => {
    return (req, res, next) => {
        // Token would typically be extracted from Authorization header
        // For now, we'll check the user object in the request body
        const { user } = req.body;

        if (!user) {
            return res.status(401).json({ message: "Authentication required" });
        }

        try {
            if (user.role !== requiredRole) {
                return res.status(403).json({ message: "Access denied. Insufficient permissions." });
            }
            next();
        } catch (error) {
            console.error("Authentication error:", error);
            return res.status(401).json({ message: "Authentication failed" });
        }
    };
};

// Protected receptionist routes
app.post("/api/attendance/start", authenticateRole("receptionist"), async (req, res) => {
    // Only receptionists can access this route
    // Implementation of attendance start functionality
    try {
        // In a real implementation, you'd store this in the database
        const sessionId = Date.now().toString();
        res.status(200).json({
            message: "Attendance session started",
            sessionId: sessionId,
            startTime: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error starting attendance session:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/api/attendance/manual-in", authenticateRole("receptionist"), async (req, res) => {
    const { studentId, studentName } = req.body;

    if (!studentId || !studentName) {
        return res.status(400).json({ message: "Student ID and name are required." });
    }

    try {
        // In a real implementation, you'd store this in the database
        res.status(200).json({
            message: "Student manually marked as present",
            timestamp: new Date().toISOString(),
            student: { id: studentId, name: studentName }
        });
    } catch (error) {
        console.error("Error marking student attendance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Protected student routes
app.post("/api/student/attendance", authenticateRole("student"), async (req, res) => {
    // Only students can access this route
    try {
        const { user } = req.body;

        // In a real implementation, you'd store this in the database
        res.status(200).json({
            message: "Student attendance recorded",
            timestamp: new Date().toISOString(),
            student: {
                id: user.id,
                name: `${user.fname} ${user.lname}`
            }
        });
    } catch (error) {
        console.error("Error recording student attendance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Student API Endpoints
app.get("/api/hostels", async (req, res) => {
    try {
        // Query to fetch all hostels
        const query = "SELECT * FROM hostels ORDER BY id";
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching hostels:", error);
        res.status(500).json({ message: "Error fetching hostels" });
    }
});

// Student profile API endpoint (CompleteProfile feature has been removed from frontend)
app.post("/api/students", async (req, res) => {
    try {
        const { reg_no, first_name, last_name, hostel_id, gender, email, account_id } = req.body;

        // Validate required fields
        if (!reg_no || !hostel_id) {
            return res.status(400).json({ message: "Registration number and hostel are required" });
        }

        // Check if registration number already exists
        const checkQuery = "SELECT * FROM students WHERE reg_no = $1";
        const checkResult = await pool.query(checkQuery, [reg_no]);

        if (checkResult.rows.length > 0) {
            return res.status(409).json({ message: "Student with this registration number already exists" });
        }

        // Add student record with all fields
        const insertQuery = "INSERT INTO students (reg_no, first_name, last_name, hostel_id, gender, email, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7)";
        await pool.query(insertQuery, [reg_no, first_name, last_name, hostel_id, gender, email, account_id]);

        res.status(201).json({
            message: "Student profile created successfully",
            reg_no
        });
    } catch (error) {
        console.error("Error creating student profile:", error);
        res.status(500).json({ message: "Failed to create student profile" });
    }
});

// Get all students with their hostel info
app.get("/api/students", async (req, res) => {
    try {
        const query = `
            SELECT s.reg_no, s.first_name, s.last_name, h.id as hostel_id, h.hostel_name, h.hostel_type
            FROM students s
            JOIN hostels h ON s.hostel_id = h.id
            ORDER BY s.reg_no
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Error fetching students" });
    }
});

app.listen(4000, () => console.log('Server running on port 4000'));