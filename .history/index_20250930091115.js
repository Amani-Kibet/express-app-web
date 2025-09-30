const express= require("express");
const cors= require("cors");
const mongoose= require("mongoose")
const multer= require("multer")
const app= express();
app.use(cors())
app.use(express.json())
app.use("/pictures", express.static("pictures"))
app.use("/pages", express.static("pages"))

mongoose.connect("mongodb://localhost:27017/Users")
.then(()=> console.log("Database Connected Successfully"))
.catch(err=> console.log("Database Failed: "+ err))

let labels= new mongoose.Schema({name: String, phone: String, password: String, piclink: String, message: String})
let contacts= mongoose.model("User Contacts", labels)

let labels2= new mongoose.Schema({input: String, output: String})
let responses= mongoose.model("Responses", labels2)

let storage1= multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, "pictures/")
  },
  filename: (req, file, cb)=>{
    cb(null, `${new Date().getMinutes()}-${file.originalname}`)
  }
})
filex= multer({storage: storage1})
app.post("/sign/path1", filex.single("image"), (req, res)=>{
  let json= JSON.parse(req.body.json)
  console.log(req.file.path);
  let user= new contacts({name: json.name, phone: json.phone, password: json.pass, piclink: `${new Date().getMinutes()}-${req.file.originalname}`})
  user.save()
  res.json({feedback: `${json.name}  Received and Saved✅`})
})

app.post("/path3", async (req, res)=>{
  var arr= await contacts.find({name: `${req.body.name}`});
  res.json({arr: arr})
  console.log(arr)
  })

  app.post("/path4", async (req, res)=>{
    let arr1= await contacts.find({phone: req.body.phone, password: req.body.pass});
    let arra;
    if(arr1.length==0){arr1=[{name: "Null"}]} else{arra=arr1}
    let arr2= await contacts.find({phone: req.body.phone2});
    console.log(arr2)
    res.json({info1: arr1[0], info2: arr2[0]})
  })

  app.post("/path5", async (req, res)=>{
    await contacts.updateOne(
      {phone: req.body.phone2},
      {$set: {message: `${req.body.input}`}}
    )
    let arr3= await contacts.find({phone: req.body.phone1});
    res.json({reply: arr3[0].message})
  })



  app.get("/path6", async (req, res) => {
    let arr4= await contacts.find();
    res.json({everyone: arr4});
  });
 
  console.log("updated")
  app.listen(process.env.PORT || 3000, ()=>console.log("Backend Started"))