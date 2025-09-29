const express= require("express");
const cors= require("cors");
const mongoose= require("mongoose")
const multer= require("multer")
const app= express();
app.use(cors())
app.use(express.json())
app.use("/pictures", express.static("pictures"))
app.use("/pages", express.static("pages"))

mongoose.connect("mongodb://localhost:27017/")
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
filex= multer({storage: storage1})
app.post("/path1", filex.single("image"), (req, res)=>{
  let json= JSON.parse(req.body.json)
  console.log(req.file.path);
  let user= new contacts({name: json.name, phone: json.phone, password: json.pass, piclink: "A"})
  user.save()
  console.log(json.name + " Received and Saved");
  res.send("Received and Saved ✅")
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

  app.get("/", (req, res)=>{
    res.send("Is it working yoh...")
  })
  app.listen(process.env.PORT || 3000, ()=>console.log("Backend Started"))