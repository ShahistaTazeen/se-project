const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
app.use(bodyParser.json());

// Create connection to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'event_management'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});
app.post('/create-event', (req, res) => {
    const { eventName } = req.body;

    // Use a unique event name or ID to create the table name
    const tableName = `event_${eventName.replace(/\s+/g, '_').toLowerCase()}`;

    // SQL query to create a new table
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            attendee_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // Execute the query
    db.query(createTableQuery, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating table', error: err });
        }
        res.status(200).json({ message: `Table for event '${eventName}' created successfully!`, table: tableName });
    });
});
// Route to insert attendee data into event table
app.post('/add-attendee', (req, res) => {
  const { eventName, attendeeName, email } = req.body;

  // Replace spaces with underscores for table names
  const tableName = `event_${eventName.replace(/\s+/g, '_').toLowerCase()}`;

  // SQL query to insert attendee data
  const sql = `INSERT INTO ${tableName} (attendee_name, email) VALUES (?, ?)`;

  db.query(sql, [attendeeName, email], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ message: 'Error inserting attendee' });
    } else {
      res.status(200).json({ message: 'Attendee added successfully!' });
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
