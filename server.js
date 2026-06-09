const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Create/Open database
const db = new sqlite3.Database("names.db");

// Create table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS names (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`);

// Add a name
app.post("/add-name", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    db.run(
        "INSERT INTO names (name) VALUES (?)",
        [name],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                success: true,
                id: this.lastID
            });
        }
    );
});

// Get all names
app.get("/names", (req, res) => {
    db.all("SELECT * FROM names", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
