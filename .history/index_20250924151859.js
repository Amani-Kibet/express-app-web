const express = require("express");
const app = express();
express().get("/", (req, res) => {
  res.send("Hello Amani! 🚀 Express is working!");
});
app.listen(3000, () => {
  console.log("Server running");
});
