const express = require("express");
const cors = require("cors");
const app = express();
const mongoose= require("mongoose")
app.use(cors());
app.use(express.text());

mongoose.connect("mongodb://localhost:27017/database 1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log("Database Conncted"))
.catch(err=> console.log(err))

const labels= new mongoose.Schema({name: String})
const Students= mongoose.model("Students", labels)

app.post("/send", (req, res)=>{
  let rec1= new Students({name: "Amani"})
  rec1.save()
})

app.listen(3000, () => {
  console.log("Started");
});
