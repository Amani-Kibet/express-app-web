// Import express and mongoose
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/myGameDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Create a schema
const scoreSchema = new mongoose.Schema({
  player: String,
  score: Number,
  date: { type: Date, default: Date.now }
});

// Create a model
const Score = mongoose.model('Score', scoreSchema);

// Routes

// Save a score
app.post('/score', async (req, res) => {
  try {
    const newScore = new Score(req.body);
    await newScore.save();
    res.json({ message: "Score saved!", data: newScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all scores
app.get('/scores', async (req, res) => {
  try {
    const scores = await Score.find();
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
