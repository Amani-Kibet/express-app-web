const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.text());

app.post('/', (req, res) => {
  res.send("Amani K")
  console.log("Sent")
});

app.listen(3000, () => {
  console.log("Started");
});
