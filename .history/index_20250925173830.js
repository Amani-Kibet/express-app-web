const express= require("express");
const cors= require("cors");
const multer= require("multer")
const mongoose= require("mongoose")
const app= express();
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://localhost:27017", )

let storage1= multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/")
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})

file1= multer({storage: storage1})
app.post("/path1", file1.single("doc"), (req, res)=>{
  console.log(req.file)
})

app.listen(3000, ()=>console.log("Backend Started"))