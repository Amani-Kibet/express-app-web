const express= require("express");
const cors= require("cors");
const multer= require("multer")
const mongoose= require("mongoose")
const app= express();
app.use(cors())
app.use(express.json())
app.use("/public", express.static("uploads"))

mongoose.connect("mongodb://localhost:27017/links", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log("Dtabase Connected Successfully"))
.catch(err=> console.log("Database Failed: "+ err))

let labels= new mongoose.Schema({link: String})
let table1= mongoose.model("Table 1", labels)

let storage1= multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/")
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})

file1= multer({storage: storage1})
app.post("/path1", file1.single("image"), (req, res)=>{
  console.log(req.file)
})

app.listen(3000, ()=>console.log("Backend Started"))