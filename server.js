const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (index.html, script.js)
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./todos.db');

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL
  )
`);

// GET /api/todos
app.get('/api/todos', (req, res) => {
  db.all('SELECT * FROM todos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/todos
app.post('/api/todos', (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: 'Task is required' });

  db.run('INSERT INTO todos (task) VALUES (?)', [task], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, task });
  });
});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM todos WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
