const express= require("express")
const cors= require("cors")
const malter= require("malter")
const app= express()

app.use(cors())
app.use(express.json())

let storage1= malter.diskStorage({
  destinition: function(req, file, cb)=>{
    cb(null, "uploads/")
  }
  filename: function(req, file, cb)=>{

  }
})