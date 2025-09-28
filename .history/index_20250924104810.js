// Import express
const express = require('express');
const app = express();

// Middleware to parse JSON
app.use(express.json());

app.get('/api/save-score', (req, res) => {
  const { player, score } = req.query;
  console.log(`Player: ${player}, Score: ${score}`);
  res.json({ success: true, msg: "Score saved!", player, score });
});

// Serve static files (HTML, CSS, JS inside "public" folder)
app.use(express.static('public'));

// Example route (optional)
app.get('/', (req, res) => {
  res.send('<h1>Go to <a href="/cardgame.html">Card Game</a></h1>');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
