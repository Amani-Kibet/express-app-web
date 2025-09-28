// Import express
const express = require('express');
const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS inside "public" folder)
app.use(express.static('public'));

// Default route
app.get('/', (req, res) => {
  res.send('<h1>Welcome Amani 🎮</h1><p>Go to <a href="/cardgame.html">Card Game</a></p>');
});


// ------------------- API ROUTES -------------------

// GET request example (send info using query params: ?player=Amani&score=150)
app.get('/api/save-score', (req, res) => {
  const { player, score } = req.query;
  console.log(`(GET) Player: ${player}, Score: ${score}`);
  res.json({ success: true, method: "GET", player, score });
});

// POST request example (send JSON in body)
app.post('/api/save-score', (req, res) => {
  const { player, score } = req.body;
  console.log(`(POST) Player: ${player}, Score: ${score}`);
  res.json({ success: true, method: "POST", message: `Score of ${score} saved for ${player}` });
});

// ---------------------------------------------------

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
const mongoose = require('mongoose');

// Replace <dbname> with any database name, e.g., "mygame"
mongoose.connect('mongodb://127.0.0.1:27017/mygame', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected!"))
.catch(err => console.error("❌ MongoDB connection failed:", err));
