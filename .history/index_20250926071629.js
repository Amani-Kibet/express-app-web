const express= require("express");
const cors= require("cors");
const mongoose= require("mongoose")
const app= express();
app.use(cors())
app.use(express.json())
app.use("/public", express.static("public"))

mongoose.connect("mongodb://localhost:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log("Dtabase Connected Successfully"))
.catch(err=> console.log("Database Failed: "+ err))

let labels= new mongoose.Schema({name: String, phone: String, password: String})
let contacts= mongoose.model("User Contacts", labels)

app.post("/path1", (req, res)=>{
  console.log(req.body);
  let user= new contacts({name: req.body.name, phone: req.body.phone, password: req.body.pass})
  user.save()
  console.log(req.body.phone + " Received and Saved")
})
app.get("/path1", (req, res)=>{
  res.send("Received and Saved ✅")
})

app.listen(3000, ()=>console.log("Backend Started"))