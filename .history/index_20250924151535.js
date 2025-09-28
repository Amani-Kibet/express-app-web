const express = require("express");
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
  res.send(`Hello Amani! 🚀 Express is working! at `);
});
app.listen(3000, () => {
  console.log(`Server running on http://localhost:${3000}`);
});
