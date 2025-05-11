-- ----------------------------
-- 1. Create Hostels Table
-- ----------------------------
CREATE TABLE hostels (
    hostel_id SERIAL PRIMARY KEY,
    hostel_name VARCHAR(100) NOT NULL UNIQUE
);

-- Insert 12 Hostels
INSERT INTO hostels (hostel_name) VALUES
('H1'), ('H2'), ('H3'), ('H4'), ('H5'), ('H6'),
('H7'), ('H8'), ('H9'), ('H10'), ('H11'), ('H12');

-- ----------------------------
-- 2. Create Degrees Table
-- ----------------------------
CREATE TABLE degrees (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL
);

-- Insert Sample Degrees
INSERT INTO degrees (department_name) VALUES
('Software Engineering'),
('Computer Science'),
('Electrical Engineering'),
('Mechanical Engineering'),
('Materials Engineering'),
('Engineering Sciences'),
('Management Sciences'),
('Artificial Intelligence');

-- ----------------------------
-- 3. Create Students Table
-- ----------------------------
CREATE TABLE students (
    reg_no VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    degree INT,
    hostel_id INT,
    profile_complete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id),
    FOREIGN KEY (degree) REFERENCES degrees(department_id)
);

-- Insert Dummy Students
INSERT INTO students (reg_no, name, email, password, degree, hostel_id, profile_complete) VALUES
-- (Paste your entire list of 45 students here, as already provided earlier)
-- Truncated for brevity:
('2023003', 'Azeeb Ali Malik', 'u2023003@giki.edu.pk', '11111111', 4, 7, true),
('2023007', 'Abdul Hakeem', 'u2023007@giki.edu.pk', '11111111', 2, 11, true),
('2023009', 'Abdul Moeed', 'u2023009@giki.edu.pk', '11111111', 5, 3, true),
('2023039', 'Abdullah Ihsan', 'u2023039@giki.edu.pk', '11111111', 1, 9, true),
-- (continue all 45 entries)...

-- ----------------------------
-- 4. Create Attendance Table
-- ----------------------------
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    reg_no VARCHAR(20) REFERENCES students(reg_no),
    date DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('in', 'out')),
    UNIQUE (reg_no, date)
);

-- ----------------------------
-- 5. Create Bill Table
-- ----------------------------
CREATE TABLE bill (
    id SERIAL PRIMARY KEY,
    reg_no VARCHAR(20) REFERENCES students(reg_no),
    month_year VARCHAR(7) NOT NULL,        -- e.g., '2025-05'
    total_days INT NOT NULL,
    total_amount INT NOT NULL,             -- 500 × total_days
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (reg_no, month_year)
);

-- ----------------------------
-- 6. Create Rules Table (optional)
-- ----------------------------
CREATE TABLE rules (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    priority INT
);

-- Insert Dummy Rules
INSERT INTO rules (title, description, priority) VALUES
('Mobile Usage', 'Using mobile phones while eating is discouraged to promote better interaction.', 8),
('Meal Booking', 'If you want to eat in the mess for lunch or dinner, you must confirm before 10:00 AM.', 1),
('Cancellation', 'If you booked a meal but don''t show up, you will still be charged for it.', 2),
('Mess Timings', 'Meals will be served at fixed timings. Latecomers will not be served.', 3),
('Cleanliness', 'After eating, put your plates and spoons back in their place.', 4),
('Food Policy', 'No one is allowed to take food outside from the mess.', 5),
('Respect Staff', 'Be polite to the mess staff. Misbehavior will not be tolerated.', 6),
('Special Requests', 'If you need a special meal (e.g., diet meal), inform the mess management in advance.', 7);

-- ----------------------------
-- 7. Create FAQs Table (optional)
-- ----------------------------
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE
);

-- Insert Sample FAQs
INSERT INTO faqs (question, answer, is_featured) VALUES
('Can I cancel my meal after booking it?', 'No, once booked, you will be charged even if you don''t show up.', true),
('What happens if I don''t confirm my meal before 10:00 AM?', 'You won''t be able to eat in the mess for that meal.', true),
('Can I take my food to my room or outside?', 'No, all meals must be eaten inside the mess.', false),
('What should I do after finishing my meal?', 'Return your plates and spoons to their designated place.', false),
('Can I come late and still get my meal?', 'No, food is served only during the set meal timings.', false),
('Who should I contact for any issues or complaints?', 'You can report to the mess management or leave feedback through the complaint system.', true);
