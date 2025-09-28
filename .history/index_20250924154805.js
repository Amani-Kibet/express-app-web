const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // important! lets Express read JSON

// Root route
app.get("/", (req, res) => {
  res.send("Welcome Amani 🚀 Express is alive!");
});

// POST route
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
