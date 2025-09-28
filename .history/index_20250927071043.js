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
    cb(null, "a.jpg")
  }
})
app.post("/path1", (req, res)=>{
  console.log(req.body);
  let user= new contacts({name: req.body.name, phone: req.body.phone, password: req.body.pass})
  user.save()
  console.log(req.body.name + " Received and Saved");
  res.send("Received and Saved ✅")
})

filex= multer({storage: storage1})
app.post("/path2", filex.single("image"), (req, res)=>{
console.log("File Received")
})

app.post("/path3", async (req, res)=>{
  var arr= await contacts.find({name: `${req.body.name}`});
  res.json({arr: arr})
  console.log(arr)
  })

  app.post("/path4", async (req, res)=>{
    let arr= await contacts.find({phone: req.body.phone, password: req.body.pass});
    let arr1;
    if(arr.length==0){arr1=[{name: "Null"}]} else{arr1=arr}
    res.json({name: arr1[0].name})
    console.log(arr1)
  })

  app.post("/path5", (req, res)=>{
    console.log(req.body)
  })
  let label2= new mongoose.Schema({page: String})
  let pages= mongoose.model("Pages", label2)
  let x= new pages({page: "<!DOCTYPE html><head><title>Main Menu</title><style>#container{background-color: rgb(136, 183, 245);width: 30rem;height: 26rem;}#title{position: relative;width: 10rem;height: 2rem;top: 10px;left: 12rem;font-size: 20px;color: red;}#pic{width: 6rem;height: 6rem;background-color: rgb(106, 248, 50);}.labels{font-size: 15px;width: 4rem;height: 1rem;color: blue;position: relative;left: 7rem;bottom: 6rem;} </style></head><body bgcolor='cyan'> <div id='container'><h4 id='title'> Main Menu</h4><div id='pic'>Pic</div><h4 class='labels'>Name</h4><h4 class='labels'>phone</h4><button id='bt1' onclick='f1()'>Button 1</button></div></body><script></script></html>"})

app.listen(3000, ()=>console.log("Backend Started"))