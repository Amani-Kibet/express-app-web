// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors()); // allow frontend to connect
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/counterDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// Schema & Model
const counterSchema = new mongoose.Schema({
  clicks: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Initialize counter (only once)
app.get('/init', async (req, res) => {
  let counter = await Counter.findOne();
  if (!counter) {
    counter = new Counter({ clicks: 0 });
    await counter.save();
  }
  res.json(counter);
});

// Update counter
app.post('/click', async (req, res) => {
  let counter = await Counter.findOne();
  if (!counter) {
    counter = new Counter({ clicks: 0 });
  }
  counter.clicks += 1;
  await counter.save();
  res.json(counter);
});

// Get counter
app.get('/count', async (req, res) => {
  let counter = await Counter.findOne();
  if (!counter) {
    counter = new Counter({ clicks: 0 });
    await counter.save();
  }
  res.json(counter);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
