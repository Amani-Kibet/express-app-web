const express= require("express")
const cors= require("cors")
const malter= require("malter")
const app= express()

app.use(cors())
app.use(express.json())

let storage1= malter.diskStorage({
  destination: function(req, file, cb){
    cb(null, "uploads/")
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})

app.post("/path1", )