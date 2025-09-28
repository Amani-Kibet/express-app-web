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

const messageSchema= new mongoose.Schema({text: String})
const Message= mongoose.model("message", messageSchema)

app.post("/send", (req, res)=>{
  console.log(req.body);
  let msg= new Message({text: "Text 1"});
  msg.save();
  console.log(msg)
})

app.listen(3000, () => {
  console.log("Started");
});
