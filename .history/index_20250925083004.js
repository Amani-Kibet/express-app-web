const express = require("express");
const cors = require("cors");
const app = express();
const mongoose= require("mongoose")
app.use(cors());
app.use(express.text());

mongoose.connect("mongodb://localhost:27017/")
app.post("/send", (req, res)=>{
  
})

app.listen(3000, () => {
  console.log("Started");
});
