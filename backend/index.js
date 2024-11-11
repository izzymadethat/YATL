const express = require("express");
const morgan = require("morgan");
const app = express();
const db = require("./db.config");

// Standard middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Logging middleware
app.use(morgan("dev"));

// Routes
app.get("/api", async (req, res) => {
  try {
    const todos = await db.query(
      "SELECT * FROM todos ORDER BY created_at DESC"
    );
    return res.status(200).json(todos.rows);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO todos (text) VALUES ($1) RETURNING *",
      [text]
    );
    const newTodo = result.rows[0];
    return res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/:id", (req, res) => {
  res.status(200).send(`Success! ID: ${req.params.id}`);
});

app.put("/api/:id", (req, res) => {
  res.status(200).send(`Success! ID: ${req.params.id}`);
});

app.delete("/api/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM todos WHERE id = $1", [id]);
    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Listening for requests on port ${port}`);
});
