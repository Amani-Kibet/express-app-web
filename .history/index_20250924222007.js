const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.text());

app.post("/send", (req, res) => {
  console.log(req.body)
});

app.listen(3000, () => {
  console.log("Started");
});
