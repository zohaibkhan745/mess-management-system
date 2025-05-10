-- Add role column to the students_accounts_info table
ALTER TABLE students_accounts_info 
ADD COLUMN
IF NOT EXISTS role VARCHAR
(20) DEFAULT 'student';

-- Create a receptionist account with a default password for testing
-- Password: admin123
INSERT INTO students_accounts_info
    (fname, lname, email, password, role)
VALUES
    ('Admin', 'User', 'admin@giki.edu.pk', 'admin123', 'receptionist')
ON CONFLICT
(email) DO NOTHING;
