const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

app.get("http://localhost:3000/send", (req, res)=>{
  x= req.body
  alert(x)
})

app.lesten(3000, ()=>{
  alert("started")
})