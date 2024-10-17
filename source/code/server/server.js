const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from css, js, and html directories
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/html', express.static(path.join(__dirname, '../html')));

// Serve the dashboard.html at the root URL ('/')
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/dashboard.html'));
});

// SQLite database connection
const db = new sqlite3.Database('../db/application.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the application database.');
    }
});

// REST API endpoints (add, delete, get applications)
app.post('/api/applications', (req, res) => {
    const { name, address, status } = req.body;
    const sql = 'INSERT INTO applications (name, address, status) VALUES (?, ?, ?)';
    db.run(sql, [name, address, status], function(err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.status(201).json({ id: this.lastID, name, address, status });
    });
});

app.delete('/api/applications', (req, res) => {
    const ids = req.body.ids; // Expecting an array of IDs to delete
    if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM applications WHERE id IN (${placeholders})`;
    db.run(sql, ids, function(err) {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.status(204).end();
    });
});

app.get('/api/applications', (req, res) => {
    const sql = 'SELECT * FROM applications';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(400).send(err.message);
        }
        console.log("Fetched applications:", rows); // Log fetched data
        res.json(rows);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
