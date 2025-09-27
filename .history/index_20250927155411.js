// index.js
const express = require("express");
const app = express();
const PORT = 3000; // you can change if needed

// Route
app.get("/", (req, res) => {
  res.send("Hello World, I'm Amani");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
