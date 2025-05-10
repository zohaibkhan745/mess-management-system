const pool = require('./database.js');
const fs = require('fs');
const path = require('path');

// Read SQL file content
const sqlFilePath = path.join(__dirname, 'add_role_column.sql');
const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

async function executeSqlScript() {
    try {
        console.log('Executing SQL script to add role column...');
        await pool.query(sqlScript);
        console.log('SQL script executed successfully!');
    } catch (err) {
        console.error('Error executing SQL script:', err);
    } finally {
        // Close the pool
        await pool.end();
    }
}

// Execute the script
executeSqlScript();
