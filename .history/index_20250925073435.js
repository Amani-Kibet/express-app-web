const express = require("express");
const cors = require("cors");
const app = express();
const mongoose= require("mongoose")

mongoose.coonect("mongodb://localhost:3000")
app.use(cors());
app.use(express.text());

app.get("/receive", (req, res)=>{
  res.send("From Backend1")
})
app.get("/receive2", (req, res)=>{
  res.send("From Backend2")
})
app.listen(3000, () => {
  console.log("Started");
});
