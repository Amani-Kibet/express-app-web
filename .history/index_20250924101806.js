// Import express
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files (HTML, CSS, JS) from "public" folder
app.use(express.static('public'));

// Basic API route (optional)
app.get('/api/score', (req, res) => {
  res.json({ score: 100, message: "Score fetched from backend!" });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
