const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to local MongoDB
mongoose.connect("mongodb://localhost:2701k7/db1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// 2. Define Schema (structure of our data)
const UserSchema = new mongoose.Schema({
  name: String,
});

// 3. Create Model (acts like a table)
const User = mongoose.model("User", UserSchema);

// 4. Route to save name into DB
app.post("/send", async (req, res) => {
  try {
    const user = new User({ name: req.body.name });
    await user.save(); // save to DB
    console.log("✅ Saved to DB:", user);
    res.json({ message: "Name saved!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Route to fetch all names
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// 6. Start server
app.listen(3000, () => {
  console.log("Started");
});
