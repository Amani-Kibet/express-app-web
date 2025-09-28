const express = require("express");
const app = express();
const PORT = 3000;

// Middleware: let Express understand JSON
app.use(express.json());

// GET route (so you don’t see "Cannot GET")
app.get("/send", (req, res) => {
  res.send("This is the GET version of /send ✅");
});

// POST route (frontend will send data here)
app.post("/send", (req, res) => {
  console.log("Data received from frontend:", req.body);
  res.json({
    message: "Data received successfully 🚀",
    data: req.body,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
