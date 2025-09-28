const express= require("express");
const cors= require("cors");
const multer= require("mlter")
const app= express();
app.use(cors())
app.use(express.json())

let storage1= multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/")
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }

  app.post("/path1", file1.single("image"), (req, res)=>{
    console.log(req.file)
  })
})