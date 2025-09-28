const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send(`Hello Amani! 🚀 Express is working! at `);
});
app.listen(3000, () => {
  console.log("Server running");
});
