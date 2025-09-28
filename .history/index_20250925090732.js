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

app.post("/send", (req, res)=>{
  console.log(req.body)
  let rec1= new Students({
    name: `${req.body.name}`,
    age: `${req.body.age}`
  })
  rec1.save()
  console.log(rec1.name+" Is Saved")
})

app.listen(3000, () => {
  console.log("Started");
});
