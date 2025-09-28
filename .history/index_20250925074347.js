const express = require("express");
const cors = require("cors");
const app = express();
const mongoose= require("mongoose")

app.use(cors());
app.use(express.text());
mongoose.coonect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=> console.log("Database Connected"))
.catch(error=> console.log("Failed to connect dp "+ error))

const messageSchema= new mongoose.Schema({text: String})
const Message= mongoose.model("message", messageSchema)

app.get("/receive", (req, res)=>{
  res.send("From Backend1")
})
app.get("/receive2", (req, res)=>{
  res.send("From Backend2")
})
app.listen(3000, () => {
  console.log("Started");
});
