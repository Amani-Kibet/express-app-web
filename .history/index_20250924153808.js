const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Root route (homepage)
app.get("/", (req, res) => {
  res.send("Welcome Amani 🚀 Express is alive!");
});

// GET /send (test in browser)
app.get("/send", (req, res) => {
  res.send("This is the GET version of /send ✅");
});

// POST /send (frontend will use this)
app.post("/send", (req, res) => {
  console.log("Data received from frontend:", req.body);
  res.json({
    message: "Data received successfully 🚀",
    data: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
