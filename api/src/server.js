import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/notes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, content, created_at FROM notes ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/notes", async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "content is required" });
  }

  const value = parseInt(content);
  if (isNaN(value) || value < 0 || value > 100) {
    return res
      .status(400)
      .json({ error: "Note must be a number between 0 and 100" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (content) VALUES ($1) RETURNING id, content, created_at",
      [value.toString()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "content is required" });
  }

  const value = parseInt(content);
  if (isNaN(value) || value < 0 || value > 100) {
    return res
      .status(400)
      .json({ error: "Note must be a number between 0 and 100" });
  }

  try {
    const result = await pool.query(
      "UPDATE notes SET content = $1 WHERE id = $2 RETURNING id, content, created_at",
      [value.toString(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
