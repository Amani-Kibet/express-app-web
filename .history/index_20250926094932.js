const express= require("express");
const cors= require("cors");
const mongoose= require("mongoose")
const multer= require("multer")
const app= express();
app.use(cors())
app.use(express.json())
app.use("/pictures", express.static("pictures"))
app.use("/pages", express.static("pages"))

mongoose.connect("mongodb://localhost:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log("Database Connected Successfully"))
.catch(err=> console.log("Database Failed: "+ err))

let labels= new mongoose.Schema({name: String, phone: String, password: String})
let contacts= mongoose.model("User Contacts", labels)

let storage1= multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "pictures/")
  },
  filename: function(req, file, cb){
    cb(null, "profilePic.jpg")
  }
})
app.post("/path1", (req, res)=>{
  console.log(req.body);
  let user= new contacts({name: req.body.name, phone: req.body.phone, password: req.body.pass})
  user.save()
  console.log(req.body.name + " Received and Saved")
})

filex= multer({storage: storage1})
app.post("/path2", filex.single("image"), (req, res)=>{
  console.log(req.file)
})
app.get("/path1", (req, res)=>{
  res.send("Received and Saved ✅")
})

app.post("/path3", async (req, res)=>{
  let arr= await contacts.find({name: `${req.body.name}`});
  console.log(arr);
  app.get("/path3", (req, res)=>{
    res.json(arr[0])
  })
})

app.listen(3000, ()=>console.log("Backend Started"))