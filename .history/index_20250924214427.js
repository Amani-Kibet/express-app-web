const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.text());

app.post("/send", (req, res) => {
  let x= req.body;
  console.log(x+"  Received")
});

app.listen(3000, () => {
  console.log("Started");
});
