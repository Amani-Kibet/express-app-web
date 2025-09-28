// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
mongoose.connect("mongodb://localhost:27017/cardGameDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Schema
const scoreSchema = new mongoose.Schema({
  player: { type: String, default: "Amani" },
  score: { type: Number, default: 0 },
});

const Score = mongoose.model("Score", scoreSchema);

// ✅ Get latest score
app.get("/score", async (req, res) => {
  let score = await Score.findOne();
  if (!score) {
    score = new Score({ player: "Amani", score: 0 });
    await score.save();
  }
  res.json(score);
});

// ✅ Update score
app.post("/score", async (req, res) => {
  let score = await Score.findOne();
  if (!score) {
    score = new Score({ player: "Amani", score: 0 });
  }
  score.score = req.body.score;
  await score.save();
  res.json(score);
});

// ✅ Serve frontend if needed
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
