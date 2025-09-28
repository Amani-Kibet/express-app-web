const express= require("express");
const cors= require("cors");
const mongoose= require("mongoose")
const app= express();
app.use(cors())
app.use(express.json())
app.use("/public", express.static("public"))

mongoose.connect("mongodb://localhost:27017/links", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log("Dtabase Connected Successfully"))
.catch(err=> console.log("Database Failed: "+ err))

let labels= new mongoose.Schema({link: String})
let table1= mongoose.model("Table 1", labels)

app.post("/path1", (req, res)=>{
  console.log(req.body)
  app.get("/path1", (req, res)=>{
    res.send(`${req.body} Saved ✅`)
  })
  
})
app.listen(3000, ()=>console.log("Backend Started"))