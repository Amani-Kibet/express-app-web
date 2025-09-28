const express = require("express");
const cors= require("cors");
const multer= require("multer");
const app= express();

app.use(cors())
app.use(express.json())

let storage1= multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "uploads/")
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})

app.post("/path1", file1.single("image"), (req, res)=>{
console.log("File Received")
})
file1= multer({storage: storage1})

app.listen(3000, ()=>{console.log("Backend Started")})