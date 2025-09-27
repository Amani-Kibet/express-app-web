// index.js
const express = require("express");
const app = express();

// Use Render's assigned port (important for deployment)
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World, I'm Amani 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
