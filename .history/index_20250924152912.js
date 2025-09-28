const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to handle JSON
app.use(express.json());

// POST route to receive data
app.post("/send", (req, res) => {
  console.log("Data received:", req.body);
  res.json({ message: "Data received successfully ✅", data: req.body });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
