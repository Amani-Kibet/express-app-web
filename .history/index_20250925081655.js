const express = require("express");
const cors = require("cors");
const app = express();
const mongoose= require("mongoose")
app.use(cors());
app.use(express.text());

mongoose.connect("mongodb://localhost:27017/db1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log("Database Connected"))
.catch(error=> console.log("Failed to connect dp "+ error))

const labels= new mongoose.Schema({label1: String})
const Table1= mongoose.model("Tabel1", labels)

app.post("/send", (req, res)=>{
  let record1= new Table1({label1: "Text 1"});
  record1.save();
  console.log(record1)
})

app.listen(3000, () => {
  console.log("Started");
});
