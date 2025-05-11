const pool = require("./database");

async function setupContentTables() {
  try {
    // Create Rules table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rules (
        rule_id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        priority INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Rules table created or already exists");

    // Create FAQs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        faq_id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("FAQs table created or already exists");

    // Check if rules table is empty and insert initial data if needed
    const rulesCount = await pool.query("SELECT COUNT(*) FROM rules");
    if (parseInt(rulesCount.rows[0].count) === 0) {
      console.log("Inserting initial rules data...");
      await pool.query(`
        INSERT INTO rules (title, description, priority) VALUES
('Meal Booking', 'If you want to eat in the mess for lunch or dinner, you must confirm before 10:00 AM.', 1),
('Cancellation', 'If you booked a meal but don''t show up, you will still be charged for it.', 2),
('Mess Timings', 'Meals will be served at fixed timings. Latecomers will not be served.', 3),
('Cleanliness', 'After eating, put your plates and spoons back in their place.', 4),
('Food Policy', 'No one is allowed to take food outside from the mess.', 5),
('Respect Staff', 'Be polite to the mess staff. Misbehavior will not be tolerated.', 6),
('Special Requests', 'If you need a special meal (e.g., diet meal), inform the mess management in advance.', 7);
      `);
      console.log("Initial rules data inserted successfully!");
    } else {
      console.log("Rules table already has data, skipping initial insert");
    }

    // Check if FAQs table is empty and insert initial data if needed
    const faqsCount = await pool.query("SELECT COUNT(*) FROM faqs");
    if (parseInt(faqsCount.rows[0].count) === 0) {
      console.log("Inserting initial FAQs data...");
      await pool.query(`
       INSERT INTO faqs (question, answer, is_featured) VALUES
('Can I cancel my meal after booking it?', 'No, once booked, you will be charged even if you don''t show up.', true),
('What happens if I don''t confirm my meal before 10:00 AM?', 'You won''t be able to eat in the mess for that meal.', true),
('Can I take my food to my room or outside?', 'No, all meals must be eaten inside the mess.', false),
('What should I do after finishing my meal?', 'Return your plates and spoons to their designated place.', false),
('Can I come late and still get my meal?', 'No, food is served only during the set meal timings.', false),
('Who should I contact for any issues or complaints?', 'You can report to the mess management or leave feedback through the complaint system.', true);

      `);
      console.log("Initial FAQs data inserted successfully!");
    } else {
      console.log("FAQs table already has data, skipping initial insert");
    }

    console.log("Content tables setup complete!");
  } catch (error) {
    console.error("Database setup error:", error);
  } finally {
    // Close the pool
    pool.end();
  }
}

setupContentTables();