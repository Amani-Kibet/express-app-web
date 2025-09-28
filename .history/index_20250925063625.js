const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.text());

app.post("/api/send", (req, res) => {
  res.text("Amani K")
});

app.listen(3000, () => {
  console.log("Started");
});
