const express = require("express");
const cors = require("cors");
const app = express();
const mongoose= require("mongoose")
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/database1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log("Database Conncted"))
.catch(err=> console.log(err))

const labels= new mongoose.Schema({
  name: String,
  age: Number
})
const Students= mongoose.model("Students", labels)

app.get("/send", async(req, res)=>{
  let arr= await Students.find();
  res.json(arr)
  })

app.listen(3000, () => {
  console.log("Started");
});
