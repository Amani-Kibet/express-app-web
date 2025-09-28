const express = require("express");
const cors = require("cors"); // import cors
const app = express();

app.use(cors()); // allow all origins
app.use(express.json());

// Handle POST request from frontend
app.post("/send", (req, res) => {
  console.log("Received data:", req.body); // log data to terminal
  res.json({ message: "Data received successfully!", data: req.body });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000 🚀");
});
