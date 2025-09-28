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
  console.log(req.file.originalname)
})

app.post("/path3", async (req, res)=>{
  var arr= await contacts.find({name: `${req.body.name}`});
  res.json({arr: arr})
  console.log(arr)
  })

  app.post("/path4", async (req, res)=>{
    let arr= await contacts.find({phone: req.body.phone, password: req.body.pass});
    let msg= "";
    if(arr.length==0){msg="Not Identified, please Sign In"} else{msg= "Login Successful"}
    console.log(arr[0].name)
    res.json({msg: arr})
  })

app.listen(3000, ()=>console.log("Backend Started"))