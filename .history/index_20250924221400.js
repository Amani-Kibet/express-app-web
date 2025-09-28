const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.text());

app.post("/send", (req, res) => {
  res.json({name: "Amani"})
  console.log("sent")
});

app.listen(3000, () => {
  console.log("Started");
});
